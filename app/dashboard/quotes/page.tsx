"use client";

import { useEffect, useState } from "react";
import { DashboardLoading } from "@/components/dashboard-loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  Mail,
  Phone,
  Building,
  Calendar,
  Package,
  DollarSign,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Quote {
  id: string;
  quoteCode: string;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  customerCompany: string | null;
  totalPrice: number;
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  status: string;
  createdAt: string;
  selectedOptions: any;
  configuration?: any;
  title?: string;
  internalNotes?: string;
  customerNotes?: string;
  validUntil?: string;
  emailSentAt?: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailMode, setEmailMode] = useState<"default" | "custom">("default");
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/quote/list");
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch quotes:", error);
        toast.error("Failed to load quotes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "default";
      case "PENDING":
        return "secondary";
      case "REJECTED":
        return "destructive";
      case "EXPIRED":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleViewQuote = (quoteCode: string) => {
    window.open(`/quote/${quoteCode}`, "_blank");
  };

  const handleDownloadQuote = async (quoteCode: string) => {
    toast.info("Quote download feature coming soon!");
  };

  const handleOpenDetails = async (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleOpenEmailDialog = () => {
    setShowEmailDialog(true);
    setEmailMode("default");
    setCustomMessage("");
  };

  const handleSendEmail = async () => {
    if (!selectedQuote) return;

    setIsSendingEmail(true);
    try {
      let emailHtml = "";
      let emailSubject = `Your Quote is Ready - ${selectedQuote.quoteCode}`;

      if (emailMode === "default") {
        // Use the default template
        const quoteLink = `${window.location.origin}/quote/${selectedQuote.quoteCode}`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Your Quote is Ready!</h1>
                </div>
                <div class="content">
                  <p>Hello ${selectedQuote.customerName || "Customer"},</p>
                  <p>Thank you for your interest. We're pleased to provide you with your quote.</p>
                  <h2>Quote Details:</h2>
                  <p><strong>Quote Code:</strong> ${selectedQuote.quoteCode}</p>
                  <p><strong>Total Price:</strong> €${Number(selectedQuote.totalPrice).toFixed(2)}</p>
                  <a href="${quoteLink}" class="button">View Full Quote</a>
                  <p>If you have any questions, please don't hesitate to contact us.</p>
                </div>
                <div class="footer">
                  <p>This is an automated email. Please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `;
      } else {
        // Custom message mode
        const quoteLink = `${window.location.origin}/quote/${selectedQuote.quoteCode}`;
        emailSubject = `Quote ${selectedQuote.quoteCode} - Product Configuration`;
        emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .custom-message { background: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0; }
                .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Quote ${selectedQuote.quoteCode}</h1>
                </div>
                <div class="content">
                  <p>Hello ${selectedQuote.customerName || "Customer"},</p>
                  <div class="custom-message">
                    ${customMessage.replace(/\n/g, "<br>")}
                  </div>
                  <h3>Quote Details:</h3>
                  <p><strong>Quote Code:</strong> ${selectedQuote.quoteCode}</p>
                  <p><strong>Total Price:</strong> €${Number(selectedQuote.totalPrice).toFixed(2)}</p>
                  <a href="${quoteLink}" class="button">View Full Quote</a>
                </div>
                <div class="footer">
                  <p>This is an automated email. Please do not reply.</p>
                </div>
              </div>
            </body>
          </html>
        `;
      }

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: selectedQuote.customerEmail,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Email send failed:", data);
        toast.error(data?.message || "Failed to send email");
        return;
      }

      toast.success("Email sent successfully to customer!");
    } catch (error) {
      console.error("Email send error:", error);
      toast.error("Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          data-testid="quotes-title"
        >
          Quotes
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage all your customer quotes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              data-testid="total-quotes-count"
            >
              {quotes.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              data-testid="pending-quotes-count"
            >
              {quotes.filter((q) => q.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
              data-testid="accepted-quotes-count"
            >
              {quotes.filter((q) => q.status === "ACCEPTED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-value">
              €
              {quotes
                .reduce((sum, q) => sum + Number(q.totalPrice), 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or quote code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full sm:w-[180px]"
                data-testid="status-filter"
              >
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>
            {filteredQuotes.length}{" "}
            {filteredQuotes.length === 1 ? "quote" : "quotes"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "Quotes will appear here when customers request them"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote Code</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow
                      key={quote.id}
                      data-testid={`quote-row-${quote.quoteCode}`}
                    >
                      <TableCell
                        className="font-mono text-sm"
                        data-testid="quote-code"
                      >
                        {quote.quoteCode}
                      </TableCell>
                      <TableCell data-testid="customer-name">
                        {quote.customerName || "—"}
                      </TableCell>
                      <TableCell data-testid="customer-email">
                        {quote.customerEmail}
                      </TableCell>
                      <TableCell
                        className="font-semibold"
                        data-testid="quote-amount"
                      >
                        €{Number(quote.totalPrice).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(quote.status)}
                          data-testid="quote-status"
                        >
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid="quote-date">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenDetails(quote)}
                            data-testid={`details-quote-${quote.quoteCode}`}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewQuote(quote.quoteCode)}
                            data-testid={`view-quote-${quote.quoteCode}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadQuote(quote.quoteCode)}
                            data-testid={`download-quote-${quote.quoteCode}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
            <DialogDescription>
              Complete information for quote {selectedQuote?.quoteCode}
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {selectedQuote.customerName || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedQuote.customerEmail}
                    </p>
                  </div>
                  {selectedQuote.customerPhone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedQuote.customerPhone}
                      </p>
                    </div>
                  )}
                  {selectedQuote.customerCompany && (
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">
                        {selectedQuote.customerCompany}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quote Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Quote Code</p>
                    <p className="font-mono font-medium">
                      {selectedQuote.quoteCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusVariant(selectedQuote.status)}>
                      {selectedQuote.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Created Date
                    </p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedQuote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedQuote.emailSentAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Email Sent
                      </p>
                      <p className="font-medium">
                        {new Date(selectedQuote.emailSentAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedQuote.validUntil && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Valid Until
                      </p>
                      <p className="font-medium">
                        {new Date(
                          selectedQuote.validUntil
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedQuote.title && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">{selectedQuote.title}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Details
                </h3>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  {selectedQuote.subtotal && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        €{Number(selectedQuote.subtotal).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {selectedQuote.taxAmount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tax{" "}
                        {selectedQuote.taxRate
                          ? `(${Number(selectedQuote.taxRate * 100).toFixed(2)}%)`
                          : ""}
                      </span>
                      <span className="font-medium">
                        €{Number(selectedQuote.taxAmount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>€{Number(selectedQuote.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Selected Options */}
              {selectedQuote.selectedOptions && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Selected Options
                  </h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedQuote.selectedOptions, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Notes */}
              {(selectedQuote.customerNotes || selectedQuote.internalNotes) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  {selectedQuote.customerNotes && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        Customer Notes
                      </p>
                      <p className="p-3 bg-muted rounded-lg">
                        {selectedQuote.customerNotes}
                      </p>
                    </div>
                  )}
                  {selectedQuote.internalNotes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Internal Notes
                      </p>
                      <p className="p-3 bg-muted rounded-lg">
                        {selectedQuote.internalNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleViewQuote(selectedQuote?.quoteCode || "")}
              data-testid="modal-view-quote-btn"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Public Quote
            </Button>
            <Button
              onClick={handleOpenEmailDialog}
              data-testid="modal-send-email-btn"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to Customer</DialogTitle>
            <DialogDescription>
              Send quote details to {selectedQuote?.customerEmail}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <RadioGroup
              value={emailMode}
              onValueChange={(value) =>
                setEmailMode(value as "default" | "custom")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default" className="font-normal cursor-pointer">
                  Send default confirmation email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Write a custom message
                </Label>
              </div>
            </RadioGroup>

            {emailMode === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Write your message to the customer..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Your message will be included along with the quote details and
                  view link.
                </p>
              </div>
            )}

            {emailMode === "default" && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  A professional email will be sent with:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Quote code and total price</li>
                  <li>Link to view the full quote</li>
                  <li>Professional formatting</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEmailDialog(false);
                setCustomMessage("");
              }}
              disabled={isSendingEmail}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={
                isSendingEmail ||
                (emailMode === "custom" && !customMessage.trim())
              }
              data-testid="confirm-send-email-btn"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
