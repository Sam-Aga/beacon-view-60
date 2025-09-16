import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, MessageCircle, MapPin, Calendar, Search, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockCommunityReports, categories } from "@/lib/mock-data";
import { CommunityReport } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [reports, setReports] = useState(mockCommunityReports);
  const { toast } = useToast();

  const handleUpvote = (reportId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const isUpvoted = report.isUpvoted;
        return {
          ...report,
          isUpvoted: !isUpvoted,
          upvotes: isUpvoted ? report.upvotes - 1 : report.upvotes + 1
        };
      }
      return report;
    }));

    toast({
      title: "Vote recorded",
      description: "Thank you for participating in your community!",
    });
  };

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

  const filterReports = (reports: CommunityReport[]) => {
    return reports
      .filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             report.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'trending':
            return b.upvotes - a.upvotes;
          case 'newest':
            return b.createdAt.getTime() - a.createdAt.getTime();
          case 'oldest':
            return a.createdAt.getTime() - b.createdAt.getTime();
          case 'most-commented':
            return b.commentsCount - a.commentsCount;
          default:
            return 0;
        }
      });
  };

  const filteredReports = filterReports(reports);

  const CommunityReportCard = ({ report }: { report: CommunityReport }) => (
    <Card className="shadow-card border-0 hover:shadow-elegant transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar>
              <AvatarImage src={report.author.avatar} alt={report.author.name} />
              <AvatarFallback className="bg-civic-blue text-white">
                {report.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-4">
                <span>by {report.author.name}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {report.createdAt.toLocaleDateString()}
                </span>
                <span className={`font-medium ${getPriorityColor(report.priority)}`}>
                  {report.priority} priority
                </span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{report.description}</p>
        
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {report.location.address}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={report.isUpvoted ? "civic" : "outline"}
              size="sm"
              onClick={() => handleUpvote(report.id)}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              {report.upvotes}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {report.commentsCount}
            </Button>
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
          <h1 className="text-3xl font-bold text-foreground">Community Reports</h1>
          <p className="text-muted-foreground">
            Discover and support issues reported by your neighbors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-civic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                Reports from your community
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <ThumbsUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.upvotes, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Community upvotes
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discussions</CardTitle>
              <MessageCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reports.reduce((sum, r) => sum + r.commentsCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total comments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search community reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="most-commented">Most Commented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Community Reports */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <CommunityReportCard key={report.id} report={report} />
              ))
            ) : (
              <Card className="shadow-card border-0">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No reports found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            {filteredReports
              .filter(r => r.upvotes >= 10)
              .map((report) => (
                <CommunityReportCard key={report.id} report={report} />
              ))}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredReports
              .filter(r => {
                const daysSinceCreated = Math.floor((Date.now() - r.createdAt.getTime()) / (1000 * 60 * 60 * 24));
                return daysSinceCreated <= 7;
              })
              .map((report) => (
                <CommunityReportCard key={report.id} report={report} />
              ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {filteredReports
              .filter(r => r.status === 'resolved')
              .map((report) => (
                <CommunityReportCard key={report.id} report={report} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}