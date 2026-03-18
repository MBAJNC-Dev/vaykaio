
import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocLayout from '@/components/docs/DocLayout.jsx';

const DeveloperDocs = () => {
  return (
    <DocLayout title="API Reference">
      <Helmet><title>API Reference | VaykAIo Developer Docs</title></Helmet>
      
      <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
        <h1>VaykAIo API Reference</h1>
        <p>
          The VaykAIo API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
        </p>

        <h2>Authentication</h2>
        <p>
          Authenticate your account by including your secret API key in the request header. You can manage your API keys in the <a href="/enterprise/api">Enterprise Dashboard</a>.
        </p>
        
        <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>

        <h2>Core Resources</h2>
        <ul>
          <li><code>/api/v1/trips</code> - Manage trip workspaces</li>
          <li><code>/api/v1/itineraries</code> - Read and write daily schedules</li>
          <li><code>/api/v1/users</code> - Manage tenant users (Enterprise only)</li>
        </ul>
      </div>

      <div className="mt-10 border rounded-xl overflow-hidden">
        <div className="bg-muted px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">Example: Fetching a Trip</h3>
        </div>
        <div className="p-4 bg-card">
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="javascript">JavaScript (Fetch)</TabsTrigger>
              <TabsTrigger value="python">Python (Requests)</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript">
<pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`const response = await fetch('https://api.vaykaio.com/v1/trips/trip_123abc', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}
</pre>
            </TabsContent>
            
            <TabsContent value="python">
<pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`import requests

url = "https://api.vaykaio.com/v1/trips/trip_123abc"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())`}
</pre>
            </TabsContent>

            <TabsContent value="curl">
<pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono">
{`curl -X GET "https://api.vaykaio.com/v1/trips/trip_123abc" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
</pre>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DocLayout>
  );
};

export default DeveloperDocs;
