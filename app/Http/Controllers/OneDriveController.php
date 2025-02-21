<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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

        return redirect()->away($authUrl);
    }

    public function handleOneDriveCallback(Request $request)
    {
        $code = $request->get('code');

        if (!$code) {
            return response()->json(['error' => 'No authorization code returned'], 400);
        }

        $response = Http::asForm()->post("https://login.microsoftonline.com/" . env('ONEDRIVE_TENANT_ID') . "/oauth2/v2.0/token", [
            'client_id' => env('ONEDRIVE_CLIENT_ID'),
            'client_secret' => env('ONEDRIVE_CLIENT_SECRET'),
            'code' => $code,
            'grant_type' => 'authorization_code',
            'redirect_uri' => env('ONEDRIVE_REDIRECT_URI'),
        ]);

        $data = $response->json();

        if (isset($data['access_token'])) {
            session(['onedrive_token' => $data['access_token']]);
            return redirect('/onedrive/files');
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
        $accessToken = session('onedrive_token');

        if (!$accessToken) {
            return redirect()->route('onedrive.redirect');
        }

        $response = Http::withToken($accessToken)->get("https://graph.microsoft.com/v1.0/me/drive/items/$fileId/content");

        return response($response->body(), 200)
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Content-Disposition', 'attachment; filename="downloaded_file"');
    }
}
