
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Copy, ExternalLink, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { RFPEmailService } from '@/services/RFPEmailService.js';
import { AIRFPService } from '@/services/AIRFPService.js';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RFPSubmissionPage = () => {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({ email: '', formUrl: '' });
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchRFP = async () => {
      try {
        const rfpData = await pb.collection('rfps').getOne(rfpId, { $autoCancel: false });
        const detailsData = await pb.collection('rfp_details').getFirstListItem(`rfp_id="${rfpId}"`, { $autoCancel: false }).catch(() => null);
        
        setRfp(rfpData);
        setDetails(detailsData);
        
        // Generate initial email content
        const content = RFPEmailService.generateEmailTemplate(rfpData, detailsData, { group_leader: pb.authStore.model.name });
        setEmailContent(content);

        // If URL exists, try to extract contact info
        if (rfpData.property_url) {
          setAiLoading(true);
          const aiResult = await AIRFPService.extractPropertyContactInfo(rfpData.property_url);
          if (aiResult.success) {
            setContactInfo({ email: aiResult.data.email, formUrl: aiResult.data.submissionFormUrl });
            toast.success('AI successfully extracted property contact details!');
          }
          setAiLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load RFP details');
      } finally {
        setLoading(false);
      }
    };

    if (rfpId) fetchRFP();
  }, [rfpId]);

  const handleSendEmail = async () => {
    if (!contactInfo.email) {
      toast.error('Please provide a recipient email address');
      return;
    }
    
    setIsSending(true);
    try {
      await RFPEmailService.sendRFPEmail(rfpId, contactInfo.email, emailContent);
      
      // Update RFP status
      await pb.collection('rfps').update(rfpId, { 
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }, { $autoCancel: false });
      
      setIsSubmitted(true);
      toast.success('RFP sent successfully!');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailContent);
    toast.success('Email content copied to clipboard');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!rfp) return <div className="text-center py-20">RFP not found</div>;

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">RFP Submitted Successfully!</h1>
        <p className="text-muted-foreground text-lg">
          Your request has been sent to {rfp.property_name}. We've added this to your tracking dashboard.
        </p>
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Reference Number</p>
            <p className="font-mono text-lg">{rfp.id.toUpperCase()}</p>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Expected Response Time: 24-48 hours</p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate('/rfp/dashboard')}>Back to Dashboard</Button>
          <Button onClick={() => navigate(`/rfp/tracking/${rfp.id}`)}>Track Status</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <Helmet><title>Submit RFP | TravelMatrix</title></Helmet>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="secondary">Draft</Badge>
          <span className="text-sm text-muted-foreground font-mono">REF: {rfp.id}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Submit Proposal Request</h1>
        <p className="text-muted-foreground mt-1">Review your generated RFP and choose a submission method.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Email</CardTitle>
                <CardDescription>Review and edit the message before sending.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Submission Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiLoading ? (
                <div className="flex items-center gap-3 text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" /> Extracting contact info...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Property Email Address</Label>
                    <Input 
                      type="email" 
                      value={contactInfo.email} 
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="sales@hotel.com" 
                    />
                  </div>
                  <Button className="w-full" onClick={handleSendEmail} disabled={isSending}>
                    {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Email Directly
                  </Button>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
              </div>

              <div className="space-y-3">
                <Label>Manual Submission</Label>
                {contactInfo.formUrl ? (
                  <Button variant="outline" className="w-full" onClick={() => window.open(contactInfo.formUrl, '_blank')}>
                    Open Property RFP Form <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">No direct form URL found. Please copy the email content and submit via the property's website.</p>
                )}
                <Button variant="secondary" className="w-full" onClick={() => {
                  pb.collection('rfps').update(rfpId, { status: 'submitted', submitted_at: new Date().toISOString() }, { $autoCancel: false })
                    .then(() => setIsSubmitted(true));
                }}>
                  Mark as Submitted Manually
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">RFP Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Property:</span> <span className="font-medium">{rfp.property_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Group Size:</span> <span className="font-medium">{rfp.group_size}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dates:</span> <span className="font-medium">{new Date(rfp.check_in_date).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rooms:</span> <span className="font-medium">{details?.rooms_needed || 'N/A'}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RFPSubmissionPage;
