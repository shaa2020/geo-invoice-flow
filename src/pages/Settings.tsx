
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define business settings schema
const businessSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  taxId: z.string().optional(),
  website: z.string().optional(),
});

// Define invoice settings schema
const invoiceSchema = z.object({
  prefix: z.string(),
  nextInvoiceNumber: z.coerce.number().int().positive(),
  includeLogoOnInvoice: z.boolean(),
  defaultDueTerms: z.coerce.number().int().nonnegative(),
  defaultTaxRate: z.coerce.number().min(0).max(100),
  defaultCurrency: z.string(),
  defaultNotes: z.string(),
});

// Define notification settings schema
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  invoiceDueReminders: z.boolean(),
  lowStockAlerts: z.boolean(),
  paymentReceivedAlerts: z.boolean(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;
type InvoiceFormValues = z.infer<typeof invoiceSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

// Default settings
const defaultBusinessSettings: BusinessFormValues = {
  businessName: "Geo Fashion",
  email: "contact@geofashion.com",
  phone: "+880 1712 345678",
  address: "123 Fashion Street, Dhaka, Bangladesh",
  taxId: "TAX-123456",
  website: "www.geofashion.com",
};

const defaultInvoiceSettings: InvoiceFormValues = {
  prefix: "INV-",
  nextInvoiceNumber: 1001,
  includeLogoOnInvoice: true,
  defaultDueTerms: 15,
  defaultTaxRate: 15,
  defaultCurrency: "BDT",
  defaultNotes: "Thank you for your business!",
};

const defaultNotificationSettings: NotificationFormValues = {
  emailNotifications: true,
  invoiceDueReminders: true,
  lowStockAlerts: true,
  paymentReceivedAlerts: true,
};

// Get settings from localStorage or use defaults
const getStoredSettings = (key: string, defaultSettings: any) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(key, JSON.stringify(defaultSettings));
  return defaultSettings;
};

const Settings = () => {
  // Load settings from localStorage
  const [businessSettings, setBusinessSettings] = useState(() => 
    getStoredSettings("businessSettings", defaultBusinessSettings)
  );
  
  const [invoiceSettings, setInvoiceSettings] = useState(() => 
    getStoredSettings("invoiceSettings", defaultInvoiceSettings)
  );
  
  const [notificationSettings, setNotificationSettings] = useState(() => 
    getStoredSettings("notificationSettings", defaultNotificationSettings)
  );

  // Initialize forms
  const businessForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: businessSettings,
  });

  const invoiceForm = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoiceSettings,
  });

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: notificationSettings,
  });

  // Update form values when settings change
  useEffect(() => {
    businessForm.reset(businessSettings);
  }, [businessSettings, businessForm]);

  useEffect(() => {
    invoiceForm.reset(invoiceSettings);
  }, [invoiceSettings, invoiceForm]);

  useEffect(() => {
    notificationForm.reset(notificationSettings);
  }, [notificationSettings, notificationForm]);

  // Submit handlers
  const onBusinessSubmit = (data: BusinessFormValues) => {
    setBusinessSettings(data);
    localStorage.setItem("businessSettings", JSON.stringify(data));
    toast.success("Business settings updated successfully");
  };

  const onInvoiceSubmit = (data: InvoiceFormValues) => {
    setInvoiceSettings(data);
    localStorage.setItem("invoiceSettings", JSON.stringify(data));
    toast.success("Invoice settings updated successfully");
  };

  const onNotificationSubmit = (data: NotificationFormValues) => {
    setNotificationSettings(data);
    localStorage.setItem("notificationSettings", JSON.stringify(data));
    toast.success("Notification settings updated successfully");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your application preferences</p>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>
                Manage your business information that appears on invoices and other documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={businessForm.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business name..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@business.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+880..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="www.business.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID</FormLabel>
                          <FormControl>
                            <Input placeholder="TAX-123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-2">
                      <FormField
                        control={businessForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Full business address..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit">Save Business Details</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>
                Customize your invoice settings and default values.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...invoiceForm}>
                <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={invoiceForm.control}
                      name="prefix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Prefix</FormLabel>
                          <FormControl>
                            <Input placeholder="INV-" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will appear before invoice numbers (e.g., INV-1001)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={invoiceForm.control}
                      name="nextInvoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next Invoice Number</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            The next invoice will use this number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={invoiceForm.control}
                      name="defaultDueTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Due Terms (days)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={invoiceForm.control}
                      name="defaultTaxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={invoiceForm.control}
                      name="defaultCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Currency</FormLabel>
                          <FormControl>
                            <Input placeholder="BDT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={invoiceForm.control}
                      name="includeLogoOnInvoice"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Include Logo on Invoices</FormLabel>
                            <FormDescription>
                              Display your business logo on invoice documents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="col-span-2">
                      <FormField
                        control={invoiceForm.control}
                        name="defaultNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Invoice Notes</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit">Save Invoice Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure your notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive email notifications for important events
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="invoiceDueReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Invoice Due Reminders</FormLabel>
                            <FormDescription>
                              Get notified when invoices are approaching due date
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="lowStockAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Low Stock Alerts</FormLabel>
                            <FormDescription>
                              Get notified when product stock falls below threshold
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="paymentReceivedAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Payment Received Alerts</FormLabel>
                            <FormDescription>
                              Get notified when payments are received
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">Save Notification Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>
                Manage user accounts and access permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-10">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">
                  User management requires authentication integration.
                </p>
                <Button variant="secondary">
                  Set Up Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
