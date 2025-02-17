"use client";

// import '@/styles/global.css';

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";

export default function Home() {
  const [searchID, setSearchID] = useState("");
  const [searchLevel, setSearchLevel] = useState("");
  const [searchDirection, setSearchDirection] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchActions, setSearchActions] = useState("");
  const [checks, setChecks] = useState([]);
  const levels = [...new Set(checks.map((c) => c.level).filter(Boolean))];
  const directions = [...new Set(checks.map((c) => c.direction).filter(Boolean))];
  const locations = [...new Set(checks.map((c) => c.location).filter(Boolean))];
  const actions = [...new Set(checks.map((c) => c.action).filter(Boolean))];
  const [selectedCheck, setSelectedCheck] = useState(null);

  useEffect(() => {
    fetch("/data/checks.json")
    .then((res) => res.json())
    .then((data) => setChecks(data))
    .catch((error) => console.error("Error loading JSON:", error));

    console.log("Loaded checks:", checks);
  }, []);

  const filteredChecks = checks.filter(check =>
    check.id?.toLowerCase().includes(searchID.toLowerCase()) &&
    check.level?.toLowerCase().includes(searchLevel.toLowerCase()) &&
    check.direction?.toLowerCase().includes(searchDirection.toLowerCase()) &&
    check.location?.toLowerCase().includes(searchLocation.toLowerCase()) &&
    check.action?.toLowerCase().includes(searchActions.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OASDiff Checks</h1>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Input id="IdFilter"
                    placeholder="Search ID..."
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                    className="flex-1"
                  />
                </TableCell>
                <TableCell>
                  <Select id="levelFilter"
                    placeholder="All Levels"
                    value={searchLevel}
                    onChange={(e) => setSearchLevel(e.target.value)}
                    options={levels}
                    className="flex-1"
                  />
                </TableCell>
                <TableCell>
                  <Select id="directionFilter"
                    placeholder="All Directions"
                    value={searchDirection}
                    onChange={(e) => setSearchDirection(e.target.value)}
                    options={directions}
                    className="flex-1"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    placeholder="All Locations"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    options={locations}
                    className="flex-1"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    placeholder="All Actions"
                    value={searchActions}
                    onChange={(e) => setSearchActions(e.target.value)}
                    options={actions}
                    className="flex-1"
                  />
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChecks.map((check, index) => (
                <TableRow key={check.id} onClick={() => setSelectedCheck(check)} className="cursor-pointer">
                  <TableCell>{index}</TableCell>
                  <TableCell>{check.id}</TableCell>
                  <TableCell>{check.level}</TableCell>
                  <TableCell>{check.direction}</TableCell>
                  <TableCell>{check.location}</TableCell>
                  <TableCell>{check.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Side Panel */}
      {selectedCheck && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 overflow-auto">
          <button onClick={() => setSelectedCheck(null)} className="absolute top-2 right-2">
            <X size={24} />
          </button>
          <h2 className="text-xl font-bold mb-4">{selectedCheck.id}</h2>
          <p><strong>ID:</strong> {selectedCheck.id}</p>
          <p><strong>Level:</strong> {selectedCheck.level}</p>
          <p><strong>Direction:</strong> {selectedCheck.direction}</p>
          <p><strong>Location:</strong> {selectedCheck.location}</p>
          <p><strong>Action:</strong> {selectedCheck.action}</p>
          <p className="mt-4"><strong>Details:</strong> {selectedCheck.details}</p>
        </div>
      )}
    </div>
   );
}
