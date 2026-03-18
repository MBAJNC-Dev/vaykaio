
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Copy, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const RFPTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!pb.authStore.isValid) return;
      try {
        const records = await pb.collection('rfp_templates').getFullList({
          filter: `user_id = "${pb.authStore.model.id}"`,
          $autoCancel: false
        });
        setTemplates(records);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>RFP Templates | TravelMatrix</title></Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RFP Templates</h1>
          <p className="text-muted-foreground mt-1">Save time by reusing standard proposal requirements.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> New Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <Card className="col-span-full bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>No templates found. Create one to speed up your workflow.</p>
            </CardContent>
          </Card>
        ) : (
          templates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{template.template_name}</CardTitle>
                <CardDescription className="capitalize">{template.group_type} • {template.default_group_size} guests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                  {template.default_requirements || 'No specific requirements set.'}
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1" variant="secondary">Use Template</Button>
                  <Button variant="outline" size="icon"><Copy className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RFPTemplatesPage;
