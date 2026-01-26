"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  CheckCircle2,
  XCircle,
  FileIcon,
  Link2,
  AlertCircle,
} from "lucide-react";

interface UploadResult {
  success: boolean;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  error?: string;
  uploadMethod?: string;
  fileSize?: number;
  mimeType?: string;
}

export default function BlobUploadTestPage() {
  // Server-side upload state
  const [serverFile, setServerFile] = useState<File | null>(null);
  const [serverUploading, setServerUploading] = useState(false);
  const [serverResult, setServerResult] = useState<UploadResult | null>(null);
  const [serverProgress, setServerProgress] = useState(0);

  // Direct SAS upload state
  const [sasFile, setSasFile] = useState<File | null>(null);
  const [sasUploading, setSasUploading] = useState(false);
  const [sasResult, setSasResult] = useState<UploadResult | null>(null);
  const [sasProgress, setSasProgress] = useState(0);
  const [sasUploadUrl, setSasUploadUrl] = useState<string>("");
  const [sasFileUrl, setSasFileUrl] = useState<string>("");

  // Token-based auth state (for external app testing)
  const [authToken, setAuthToken] = useState<string>("");
  const [useTokenAuth, setUseTokenAuth] = useState(false);

  /**
   * Server-side upload via POST /api/files/upload
   */
  const handleServerUpload = async () => {
    if (!serverFile) return;

    setServerUploading(true);
    setServerProgress(10);
    setServerResult(null);

    try {
      const formData = new FormData();
      formData.append("file", serverFile);

      // Add token if using token-based auth
      if (useTokenAuth && authToken) {
        formData.append("token", authToken);
      }

      setServerProgress(30);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
        headers:
          useTokenAuth && authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {},
      });

      setServerProgress(70);

      const data = await response.json();

      setServerProgress(100);

      if (response.ok && data.success) {
        setServerResult({
          success: true,
          url: data.data.url,
          fileName: data.data.originalName,
          uploadMethod: "Server-side (POST /api/files/upload)",
          fileSize: data.data.size,
          mimeType: data.data.mimeType,
        });
      } else {
        setServerResult({
          success: false,
          error: data.error || "Upload failed",
        });
      }
    } catch (error: any) {
      setServerResult({
        success: false,
        error: error.message || "Network error",
      });
    } finally {
      setServerUploading(false);
      setTimeout(() => setServerProgress(0), 2000);
    }
  };

  /**
   * Direct upload via SAS URL
   * Step 1: Get signed URL from GET /api/files/upload
   * Step 2: PUT file directly to Azure Blob Storage
   */
  const handleDirectUpload = async () => {
    if (!sasFile) return;

    setSasUploading(true);
    setSasProgress(10);
    setSasResult(null);

    try {
      // Step 1: Get signed upload URL
      const params = new URLSearchParams({
        filename: sasFile.name,
        contentType: sasFile.type,
      });

      // Add token if using token-based auth
      if (useTokenAuth && authToken) {
        params.append("token", authToken);
      }

      setSasProgress(20);

      const response = await fetch(`/api/files/upload?${params.toString()}`, {
        method: "GET",
        headers:
          useTokenAuth && authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {},
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to get upload URL");
      }

      const { uploadUrl, fileUrl, key } = data.data;
      setSasUploadUrl(uploadUrl);
      setSasFileUrl(fileUrl);

      setSasProgress(40);

      // Step 2: Upload directly to Azure Blob Storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: sasFile,
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": sasFile.type,
        },
      });

      setSasProgress(80);

      if (!uploadResponse.ok) {
        throw new Error(`Azure upload failed: ${uploadResponse.statusText}`);
      }

      setSasProgress(100);

      setSasResult({
        success: true,
        url: fileUrl,
        fileUrl: fileUrl,
        fileName: sasFile.name,
        uploadMethod: "Direct SAS URL (PUT to Azure Blob)",
        fileSize: sasFile.size,
        mimeType: sasFile.type,
      });
    } catch (error: any) {
      setSasResult({
        success: false,
        error: error.message || "Upload failed",
      });
    } finally {
      setSasUploading(false);
      setTimeout(() => setSasProgress(0), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="page-title">
          Azure Blob Storage Upload Test
        </h1>
        <p className="text-muted-foreground text-lg">
          Test file uploads using server-side and direct SAS URL methods
        </p>
      </div>

      {/* Authentication Mode */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Mode</CardTitle>
          <CardDescription>
            Choose between session-based auth (logged in user) or token-based
            auth (external app)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant={!useTokenAuth ? "default" : "outline"}
                onClick={() => setUseTokenAuth(false)}
                data-testid="session-auth-button"
              >
                Session Auth (Logged In)
              </Button>
              <Button
                variant={useTokenAuth ? "default" : "outline"}
                onClick={() => setUseTokenAuth(true)}
                data-testid="token-auth-button"
              >
                Token Auth (External App)
              </Button>
              <Badge variant={useTokenAuth ? "default" : "secondary"}>
                {useTokenAuth ? "Token Mode" : "Session Mode"}
              </Badge>
            </div>

            {useTokenAuth && (
              <div className="space-y-2">
                <Label htmlFor="auth-token">Edit Token (JWT)</Label>
                <Input
                  id="auth-token"
                  type="text"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  data-testid="auth-token-input"
                />
                <p className="text-sm text-muted-foreground">
                  Generate an edit token from{" "}
                  <code className="bg-muted px-1 rounded">
                    /api/configurator/generate-edit-token
                  </code>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="server" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="server" data-testid="server-upload-tab">
            Server-Side Upload
          </TabsTrigger>
          <TabsTrigger value="sas" data-testid="sas-upload-tab">
            Direct SAS Upload
          </TabsTrigger>
        </TabsList>

        {/* Server-Side Upload */}
        <TabsContent value="server" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Server-Side Upload (POST)
              </CardTitle>
              <CardDescription>
                Upload file via server route - file passes through your API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-file">Select File</Label>
                <Input
                  id="server-file"
                  type="file"
                  onChange={(e) => setServerFile(e.target.files?.[0] || null)}
                  disabled={serverUploading}
                  data-testid="server-file-input"
                />
                {serverFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileIcon className="h-4 w-4" />
                    <span>
                      {serverFile.name} ({formatFileSize(serverFile.size)})
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleServerUpload}
                disabled={!serverFile || serverUploading}
                className="w-full"
                data-testid="server-upload-button"
              >
                {serverUploading ? "Uploading..." : "Upload to Server"}
              </Button>

              {serverUploading && serverProgress > 0 && (
                <div className="space-y-2">
                  <Progress
                    value={serverProgress}
                    data-testid="server-progress"
                  />
                  <p className="text-sm text-center text-muted-foreground">
                    {serverProgress}% complete
                  </p>
                </div>
              )}

              {serverResult && (
                <Alert
                  variant={serverResult.success ? "default" : "destructive"}
                  data-testid="server-result"
                >
                  {serverResult.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {serverResult.success
                      ? "Upload Successful!"
                      : "Upload Failed"}
                  </AlertTitle>
                  <AlertDescription className="space-y-2">
                    {serverResult.success ? (
                      <>
                        <div className="space-y-1">
                          <p>
                            <strong>Method:</strong> {serverResult.uploadMethod}
                          </p>
                          <p>
                            <strong>File:</strong> {serverResult.fileName}
                          </p>
                          <p>
                            <strong>Size:</strong>{" "}
                            {serverResult.fileSize
                              ? formatFileSize(serverResult.fileSize)
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Type:</strong> {serverResult.mimeType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded">
                          <Link2 className="h-4 w-4 flex-shrink-0" />
                          <a
                            href={serverResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm break-all hover:underline text-blue-600"
                            data-testid="server-file-url"
                          >
                            {serverResult.url}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p>{serverResult.error}</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Direct SAS Upload */}
        <TabsContent value="sas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Direct SAS URL Upload (Client-Side)
              </CardTitle>
              <CardDescription>
                Get signed URL from server, then upload directly to Azure Blob
                Storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Two-Step Process</AlertTitle>
                <AlertDescription>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>GET /api/files/upload?filename=...&contentType=...</li>
                    <li>PUT file directly to Azure Blob Storage URL</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="sas-file">Select File</Label>
                <Input
                  id="sas-file"
                  type="file"
                  onChange={(e) => setSasFile(e.target.files?.[0] || null)}
                  disabled={sasUploading}
                  data-testid="sas-file-input"
                />
                {sasFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileIcon className="h-4 w-4" />
                    <span>
                      {sasFile.name} ({formatFileSize(sasFile.size)})
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleDirectUpload}
                disabled={!sasFile || sasUploading}
                className="w-full"
                data-testid="sas-upload-button"
              >
                {sasUploading ? "Uploading..." : "Upload via SAS URL"}
              </Button>

              {sasUploading && sasProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={sasProgress} data-testid="sas-progress" />
                  <p className="text-sm text-center text-muted-foreground">
                    {sasProgress}% complete
                  </p>
                </div>
              )}

              {sasUploadUrl && (
                <div className="space-y-2 p-3 bg-muted rounded-md">
                  <p className="text-sm font-semibold">Step 1: Got SAS URL</p>
                  <p className="text-xs break-all font-mono">{sasUploadUrl}</p>
                </div>
              )}

              {sasResult && (
                <Alert
                  variant={sasResult.success ? "default" : "destructive"}
                  data-testid="sas-result"
                >
                  {sasResult.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {sasResult.success ? "Upload Successful!" : "Upload Failed"}
                  </AlertTitle>
                  <AlertDescription className="space-y-2">
                    {sasResult.success ? (
                      <>
                        <div className="space-y-1">
                          <p>
                            <strong>Method:</strong> {sasResult.uploadMethod}
                          </p>
                          <p>
                            <strong>File:</strong> {sasResult.fileName}
                          </p>
                          <p>
                            <strong>Size:</strong>{" "}
                            {sasResult.fileSize
                              ? formatFileSize(sasResult.fileSize)
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Type:</strong> {sasResult.mimeType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded">
                          <Link2 className="h-4 w-4 flex-shrink-0" />
                          <a
                            href={sasResult.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm break-all hover:underline text-blue-600"
                            data-testid="sas-file-url"
                          >
                            {sasResult.fileUrl}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p>{sasResult.error}</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Documentation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Authentication Methods</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Session-based:</strong> Uses NextAuth session (logged in
                users)
              </li>
              <li>
                <strong>Token-based:</strong> Uses JWT edit token in
                Authorization header or request body
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Server-Side Upload</h3>
            <code className="block bg-muted p-2 rounded text-xs">
              POST /api/files/upload
              <br />
              Content-Type: multipart/form-data
              <br />
              Body: file (File), token (optional)
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Direct SAS Upload</h3>
            <code className="block bg-muted p-2 rounded text-xs">
              GET /api/files/upload?filename=...&contentType=...&token=...
              <br />
              Returns: {`{ uploadUrl, fileUrl, key }`}
              <br />
              <br />
              Then: PUT {"{fileUrl}"} with file content
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
