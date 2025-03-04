<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Http;

class OneDriveController extends Controller
{
    public function redirectToOneDrive()
    {
        $clientId = env('ONEDRIVE_CLIENT_ID');
        $redirectUri = env('ONEDRIVE_REDIRECT_URI');
        $tenantId = env('ONEDRIVE_TENANT_ID');
    
        $authUrl = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/authorize?" . http_build_query([
            'client_id' => $clientId,
            'response_type' => 'code',
            'redirect_uri' => $redirectUri,
            'scope' => 'Files.Read Files.Read.All offline_access',
            'response_mode' => 'query',
        ]);
    
        return redirect()->away($authUrl);  // Aqui, o redirecionamento é feito corretamente.
    }
    

    public function handleOneDriveCallback(Request $request)
    {
        $code = $request->get('code');
    
        if (!$code) {
            return response()->json(['error' => 'No authorization code returned'], 400);
        }
    
        // URL do endpoint do Microsoft OAuth para obter o token
        $url = "https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token";
    
        // Dados que serão enviados no corpo da requisição
        $data = [
            'client_id' => env('ONEDRIVE_CLIENT_ID'),
            'client_secret' => env('ONEDRIVE_CLIENT_SECRET'),
            'code' => $code,
            'grant_type' => 'authorization_code',
            'redirect_uri' => env('ONEDRIVE_REDIRECT_URI'),
        ];
    
        // Inicializa o cURL
        $ch = curl_init();
    
        // Configurações do cURL
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
        ]);
    
        // Executa a requisição
        $response = curl_exec($ch);
    
        // Checa se houve erro na requisição
        if(curl_errno($ch)) {
            return response()->json(['error' => curl_error($ch)], 400);
        }
    
        // Fecha o cURL
        curl_close($ch);
    
        // Converte a resposta para array
        $data = json_decode($response, true);
    
        // Verifica se o token foi retornado
        if (isset($data['access_token'])) {
            session([
                'onedrive_token' => $data['access_token'],
                'onedrive_refresh_token' => $data['refresh_token'],
                'onedrive_token_expires' => now()->addSeconds($data['expires_in']),
            ]);
    
            return redirect('/dashboard');
        }
    
        return response()->json(['error' => 'Failed to authenticate'], 400);
    }
    


    public function listFiles()
    {
        $accessToken = session('onedrive_token');

        if (!$accessToken) {
            return redirect()->route('onedrive.redirect');
        }

        $response = Http::withToken($accessToken)->get('https://graph.microsoft.com/v1.0/me/drive/root/children');

        return response()->json($response->json());
    }

    public function downloadFile($fileId)
    {
        $accessToken = $this->getValidAccessToken();

        if (!$accessToken) {
            return redirect()->route('onedrive.redirect');
        }

        $fileMeta = Http::withToken($accessToken)->get("https://graph.microsoft.com/v1.0/me/drive/items/$fileId");

        if ($fileMeta->failed()) {
            return response()->json(['error' => 'Arquivo não encontrado'], 404);
        }

        $downloadUrl = $fileMeta->json()['@microsoft.graph.downloadUrl'] ?? null;

        if (!$downloadUrl) {
            return response()->json(['error' => 'Não foi possível obter a URL de download'], 400);
        }

        return redirect()->away($downloadUrl);
    }


    private function getValidAccessToken()
    {
        $accessToken = session('onedrive_token');
        $expiresAt = session('onedrive_token_expires');

        if (!$accessToken || now()->greaterThan($expiresAt)) {
            $refreshToken = session('onedrive_refresh_token');

            if (!$refreshToken) {
                return null;
            }

            $response = Http::asForm()->post("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token", [
                'client_id' => env('ONEDRIVE_CLIENT_ID'),
                'client_secret' => env('ONEDRIVE_CLIENT_SECRET'),
                'refresh_token' => $refreshToken,
                'grant_type' => 'refresh_token',
            ]);

            $data = $response->json();

            if (isset($data['access_token'])) {
                session([
                    'onedrive_token' => $data['access_token'],
                    'onedrive_refresh_token' => $data['refresh_token'] ?? $refreshToken,
                    'onedrive_token_expires' => now()->addSeconds($data['expires_in']),
                ]);

                return $data['access_token'];
            }

            return null;
        }

        return $accessToken;
    }


    public function files()
{
    $accessToken = $this->getValidAccessToken(); // Obtém o token válido
    
    if (!$accessToken) {
        return redirect()->route('onedrive.redirect');
    }

    // Faz a requisição para listar os arquivos na raiz do OneDrive
   $response = Http::withToken($accessToken)
                ->withoutVerifying()
                ->get("https://graph.microsoft.com/v1.0/me/drive/root/children");


    // Verifica se a requisição falhou
    if ($response->failed()) {
        // Log de erro detalhado
        Log::error('Erro ao acessar OneDrive', [
            'status' => $response->status(),
            'response' => $response->json(),
        ]);

        return inertia('Companies/OneDriveFiles', [
            'company' => 1,
            'files' => [],
            'error' => 'Falha ao carregar arquivos do OneDrive',
        ]);
    }

    // Processa a resposta e formata os dados
    $files = collect($response->json()['value'] ?? [])
        ->map(function ($file) {
            return [
                'id' => $file['id'],
                'name' => $file['name'],
                'downloadUrl' => $file['@microsoft.graph.downloadUrl'] ?? "/onedrive/download/{$file['id']}",
            ];
        })
        ->toArray();

    return inertia('Companies/OneDriveFiles', [
        'company' => 1,
        'files' => $files,
        'error' => null,
    ]);
}


}
