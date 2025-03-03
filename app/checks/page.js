"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function Page() {
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

  return (
      <Card className="fixed inset-0 pt-16 px-6 pb-6 text-white bg-gray-900 overflow-hidden">
        <div className="flex flex-row gap-6 h-full">
          {/* Left side - Table */}
          <div className="w-[calc(100%-24rem)]">
              {/* Fixed Header */}
              <div className="top-0 bg-gray-800">
                <Table className="bg-gray-800 text-white w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-800">
                      <TableHead className="p-2 text-white w-[5%] text-center min-w-0">#</TableHead>
                      <TableHead className="p-2 text-white w-[35%] min-w-0">ID</TableHead>
                      <TableHead className="p-2 text-white w-[15%] min-w-0">Level</TableHead>
                      <TableHead className="p-2 text-white w-[15%] min-w-0">Direction</TableHead>
                      <TableHead className="p-2 text-white w-[15%] min-w-0">Location</TableHead>
                      <TableHead className="p-2 text-white w-[15%] min-w-0">Action</TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-800">
                      <TableCell className="w-[5%] min-w-0"></TableCell>
                      <TableCell className="w-[35%] min-w-0">
                        <Input id="IdFilter"
                          placeholder="Search ID..."
                          value={searchID}
                          onChange={(e) => setSearchID(e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="w-[15%] min-w-0">
                        <Select id="levelFilter"
                          placeholder="All Levels"
                          value={searchLevel}
                          onChange={(e) => setSearchLevel(e.target.value)}
                          options={levels}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="w-[15%] min-w-0">
                        <Select id="directionFilter"
                          placeholder="All Directions"
                          value={searchDirection}
                          onChange={(e) => setSearchDirection(e.target.value)}
                          options={directions}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="w-[15%] min-w-0">
                        <Select 
                          placeholder="All Locations"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          options={locations}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="w-[15%] min-w-0">
                        <Select
                          placeholder="All Actions"
                          value={searchActions}
                          onChange={(e) => setSearchActions(e.target.value)}
                          options={actions}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-auto h-[calc(100vh-15rem)] border-b">
                <Table className="bg-gray-800 text-white w-full">
                  <TableBody>
                    {filteredChecks.map((check, index) => (
                      <TableRow 
                        key={check.id} 
                        onClick={() => setSelectedCheck(check)} 
                        className={`cursor-pointer hover:bg-gray-700 ${selectedCheck && selectedCheck.id === check.id ? 'bg-gray-700' : 'bg-gray-800'}`}
                      >
                        <TableCell className="p-2 text-white w-[5%] min-w-0 text-center">{index}</TableCell>
                        <TableCell className="p-2 text-white w-[35%] min-w-0">{check.id}</TableCell>
                        <TableCell className="p-2 text-white w-[15%] min-w-0">{check.level}</TableCell>
                        <TableCell className="p-2 text-white w-[15%] min-w-0">{check.direction}</TableCell>
                        <TableCell className="p-2 text-white w-[15%] min-w-0">{check.location}</TableCell>
                        <TableCell className="p-2 text-white w-[15%] min-w-0">{check.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
          </div>

          {/* Right side - Panel */}
          <div className="w-96 overflow-y-auto">
            {selectedCheck ? (
              <>
                <h2 className="text-xl font-bold mb-4">{selectedCheck.id}</h2>
                <p><strong>ID:</strong> {selectedCheck.id}</p>
                <p><strong>Level:</strong> {selectedCheck.level}</p>
                <p><strong>Direction:</strong> {selectedCheck.direction}</p>
                <p><strong>Location:</strong> {selectedCheck.location}</p>
                <p><strong>Action:</strong> {selectedCheck.action}</p>
                <p className="mt-4"><strong>Details:</strong> {selectedCheck.detailed_description}</p>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Select a check to view details</p>
              </div>
            )}
          </div>
        </div>
      </Card>
  );
}
