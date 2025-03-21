'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useInventory } from '@/lib/inventory-context';
import { downloadDummyReport } from '@/lib/report-utils';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { categories: inventoryCategories } = useInventory();
  const { toast } = useToast();

  // Default values for form
  const defaultReportType = 'full';
  const defaultIncludeImages = true;
  const defaultIncludeReceipts = true;
  const defaultIncludeWarranty = true;

  const [reportType, setReportType] = useState(defaultReportType);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [includeImages, setIncludeImages] = useState(defaultIncludeImages);
  const [includeReceipts, setIncludeReceipts] = useState(
    defaultIncludeReceipts
  );
  const [includeWarranty, setIncludeWarranty] = useState(
    defaultIncludeWarranty
  );

  // Use actual categories from inventory context if available
  const categories =
    inventoryCategories.length > 0
      ? inventoryCategories
      : [
          { id: '1', name: 'Electronics', itemCount: 0 },
          { id: '2', name: 'Furniture', itemCount: 0 },
          { id: '3', name: 'Appliances', itemCount: 0 },
          { id: '4', name: 'Jewelry', itemCount: 0 },
          { id: '5', name: 'Art', itemCount: 0 },
          { id: '6', name: 'Clothing', itemCount: 0 },
        ];

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((cat) => cat.id));
    }
  };

  // Reset form to default values
  const handleReset = () => {
    setReportType(defaultReportType);
    setSelectedCategories([]);
    setIncludeImages(defaultIncludeImages);
    setIncludeReceipts(defaultIncludeReceipts);
    setIncludeWarranty(defaultIncludeWarranty);
  };

  // Generate and download report
  const handleGenerateReport = () => {
    const reportName = `${reportType}-inventory-report`;
    downloadDummyReport(reportName);

    toast({
      title: 'Report Generated',
      description: 'Your report has been generated and downloaded.',
    });
  };

  // Download existing report
  const handleDownloadExistingReport = (reportName: string) => {
    downloadDummyReport(reportName);

    toast({
      title: 'Report Downloaded',
      description: `The ${reportName} has been downloaded.`,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Generate Reports
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
              <CardDescription>Customize your inventory report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Inventory Report</SelectItem>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="value">Value Report</SelectItem>
                    <SelectItem value="warranty">Warranty Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="border rounded-md p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedCategories.length === categories.length}
                      onCheckedChange={handleSelectAllCategories}
                    />
                    <Label htmlFor="select-all" className="font-medium">
                      Select All
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.id)
                          }
                        />
                        <Label htmlFor={`category-${category.id}`}>
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Include</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-images"
                      checked={includeImages}
                      onCheckedChange={(checked) => setIncludeImages(!!checked)}
                    />
                    <Label htmlFor="include-images">Images</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-receipts"
                      checked={includeReceipts}
                      onCheckedChange={(checked) =>
                        setIncludeReceipts(!!checked)
                      }
                    />
                    <Label htmlFor="include-receipts">Receipts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-warranty"
                      checked={includeWarranty}
                      onCheckedChange={(checked) =>
                        setIncludeWarranty(!!checked)
                      }
                    />
                    <Label htmlFor="include-warranty">
                      Warranty Information
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleGenerateReport}>Generate Report</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                Your previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Full Inventory Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated on March 15, 2025
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDownloadExistingReport('full-inventory-report')
                    }
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Electronics Category Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated on March 10, 2025
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDownloadExistingReport(
                        'electronics-category-report'
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Warranty Expiration Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated on March 5, 2025
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDownloadExistingReport('warranty-expiration-report')
                    }
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
