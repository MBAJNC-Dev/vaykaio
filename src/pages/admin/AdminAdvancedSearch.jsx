
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

const AdminAdvancedSearch = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      <Helmet><title>Advanced Search | Admin</title></Helmet>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
        <p className="text-muted-foreground">Deep search across all system collections and logs.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by ID, email, name, or content..." 
                className="pl-10 h-12 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px] h-12">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="plans">Travel Plans</SelectItem>
                <SelectItem value="transactions">Transactions</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-12 px-8"><Search className="w-4 h-4 mr-2" /> Search</Button>
          </div>
          
          <div className="mt-8 text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <Filter className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
            <p className="text-muted-foreground">Enter a query to search across the database.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAdvancedSearch;
