"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { X } from "lucide-react";

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
    <div className="p-6 max-w-full mx-auto text-white bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">OASDiff Checks</h1>
      <div className="flex flex-row gap-6">
        {/* Left side - Table */}
        <div className="w-[calc(100%-24rem)]">
          <Card className="bg-gray-800 text-white">
            <CardContent className="h-[calc(100vh-12rem)] overflow-auto">
              <Table className="bg-gray-800 text-white">
                <TableHeader>
                  <TableRow className="bg-gray-800">
                    <TableHead className="text-white">#</TableHead>
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Level</TableHead>
                    <TableHead className="text-white">Direction</TableHead>
                    <TableHead className="text-white">Location</TableHead>
                    <TableHead className="text-white">Action</TableHead>
                  </TableRow>
                  <TableRow className="bg-gray-800">
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
                    <TableRow key={check.id} onClick={() => setSelectedCheck(check)} className={`cursor-pointer bg-gray-800 hover:bg-gray-700 ${selectedCheck && selectedCheck.id === check.id ? 'bg-gray-700' : ''}`}>
                      <TableCell className="text-white">{index}</TableCell>
                      <TableCell className="text-white">{check.id}</TableCell>
                      <TableCell className="text-white">{check.level}</TableCell>
                      <TableCell className="text-white">{check.direction}</TableCell>
                      <TableCell className="text-white">{check.location}</TableCell>
                      <TableCell className="text-white">{check.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Panel */}
        <div className="w-96 bg-gray-800 rounded-lg shadow-lg p-6 fixed top-24 right-6 bottom-6 overflow-y-auto">
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
    </div>
  );
}
