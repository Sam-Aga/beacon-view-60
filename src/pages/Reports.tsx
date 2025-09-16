import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Search, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockReports } from "@/lib/mock-data";
import { Report } from "@/types";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-white';
      case 'in-progress': return 'bg-civic-blue text-white';
      case 'resolved': return 'bg-success text-white';
      case 'rejected': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const filterReports = (reports: Report[]) => {
    return reports
      .filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             report.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'oldest':
            return a.createdAt.getTime() - b.createdAt.getTime();
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case 'upvotes':
            return b.upvotes - a.upvotes;
          default:
            return 0;
        }
      });
  };

  const pendingReports = filterReports(mockReports.filter(r => r.status === 'pending'));
  const inProgressReports = filterReports(mockReports.filter(r => r.status === 'in-progress'));
  const resolvedReports = filterReports(mockReports.filter(r => r.status === 'resolved'));
  const allReports = filterReports(mockReports);

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="shadow-card border-0 hover:shadow-elegant transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{report.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {report.location.address}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
            <span className={`text-sm font-medium ${getPriorityColor(report.priority)}`}>
              {report.priority} priority
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{report.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {report.createdAt.toLocaleDateString()}
            </span>
            <span>{report.upvotes} upvotes</span>
          </div>
          <Badge variant="outline">{report.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
          <p className="text-muted-foreground">
            Track the status of your community reports
          </p>
        </div>

        {/* Filters */}
        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="upvotes">Most Upvoted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({allReports.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingReports.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressReports.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedReports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allReports.length > 0 ? (
              allReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            ) : (
              <Card className="shadow-card border-0">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No reports found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingReports.length > 0 ? (
              pendingReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            ) : (
              <Card className="shadow-card border-0">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No pending reports.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressReports.length > 0 ? (
              inProgressReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            ) : (
              <Card className="shadow-card border-0">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No reports currently in progress.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {resolvedReports.length > 0 ? (
              resolvedReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))
            ) : (
              <Card className="shadow-card border-0">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No resolved reports yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}