import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockReports, mockUser } from "@/lib/mock-data";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const pendingReports = mockReports.filter(r => r.status === 'pending').length;
  const inProgressReports = mockReports.filter(r => r.status === 'in-progress').length;
  const resolvedReports = mockReports.filter(r => r.status === 'resolved').length;
  const totalUpvotes = mockReports.reduce((sum, r) => sum + r.upvotes, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-white';
      case 'in-progress': return 'bg-civic-blue text-white';
      case 'resolved': return 'bg-success text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {mockUser.name}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your community reporting activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockReports.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolvedReports}</div>
              <p className="text-xs text-muted-foreground">
                Issues fixed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-civic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUpvotes}</div>
              <p className="text-xs text-muted-foreground">
                Total upvotes received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-card border-0 hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-civic-blue" />
                Submit New Report
              </CardTitle>
              <CardDescription>
                Report a new issue in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/report">
                <Button variant="civic" className="w-full">
                  Create Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-civic-teal" />
                Explore Map
              </CardTitle>
              <CardDescription>
                View reported issues on an interactive map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/map">
                <Button variant="outline" className="w-full">
                  Open Map
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 hover:shadow-elegant transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Community Feed
              </CardTitle>
              <CardDescription>
                See what others are reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/community">
                <Button variant="outline" className="w-full">
                  View Community
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Your latest community reports</CardDescription>
              </div>
              <Link to="/reports">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockReports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {report.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {report.location.address}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {report.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}