'use client'
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleListPaginated } from "@/lib/api";

interface RoleEntry {
  id: string;
  name: string;
  joinedDate: string;
}

interface RoleListCardProps {
  role: "nd" | "ss" | "db" | "retailer";
  title: string;
}


// const RoleListCard = ({ role, title }: RoleListCardProps) => {
export const RoleListCard: React.FC<RoleListCardProps> = ({ role, title }) => {
  const [entries, setEntries] = useState<RoleEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
  console.debug("Fetching role list", { role, page });
  const data = await getRoleListPaginated(role, page, 10);
  console.debug("API response", data);
  setEntries(data.entries);
  setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        console.error("Error fetching role list for", role, err);
        setError("Failed to fetch data");
        if (err?.response) {
          setError(`Failed to fetch data: ${err.response.status} ${err.response.statusText}`);
        } else if (err?.message) {
          setError(`Failed to fetch data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, page]);

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105 px-2 pb-2">
      <div className="p-6 pb-4 flex flex-row items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      <div className="px-6 pb-6">
        {loading ? (
          <Skeleton className="h-32 w-full rounded-xl" />
        ) : error ? (
          <div className="text-red-500 font-medium py-8 text-center">{error}</div>
        ) : (
          <div className="rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border p-4">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-right py-2 font-semibold text-gray-700 dark:text-gray-300">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gradient-to-r hover:from-electric-purple/10 hover:to-electric-blue/10 transition-colors rounded-xl border-b-2">
                    <td className="py-2 font-medium text-gray-700 dark:text-gray-300">{entry.name}</td>
                    <td className="text-right py-2 text-gray-500 dark:text-gray-400">{new Date(entry.joinedDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 font-semibold"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 font-semibold"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};


// export default RoleListCard;
