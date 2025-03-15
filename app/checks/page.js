"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import styles from './styles.module.css';

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
    .then((data) => {
      setChecks(data);
      console.log("Loaded checks:", data);
    })
    .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const filteredChecks = checks.filter(check =>
    check.id?.toLowerCase().includes(searchID.toLowerCase()) &&
    check.level?.toLowerCase().includes(searchLevel.toLowerCase()) &&
    check.direction?.toLowerCase().includes(searchDirection.toLowerCase()) &&
    check.location?.toLowerCase().includes(searchLocation.toLowerCase()) &&
    check.action?.toLowerCase().includes(searchActions.toLowerCase())
  );

  return (
      <Card className="fixed inset-0 pt-24 px-6 pb-6 text-[var(--foreground)] bg-[var(--background)] overflow-hidden">
        <div className="flex flex-row gap-6 h-full">
          {/* Left side - Table */}
          <div className="w-[calc(100%-24rem)]">
              {/* Fixed Header */}
              <div className={styles.tableHeader}>
                <Table className={styles.tableContainer}>
                  <TableHeader>
                    <TableRow className={styles.tableRow}>
                      <TableHead className={`${styles.tableCell} ${styles.tableCellIndex} text-[var(--foreground)]`}>#</TableHead>
                      <TableHead className={`${styles.tableCell} ${styles.tableCellId} text-[var(--foreground)]`}>ID</TableHead>
                      <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)]`}>Level</TableHead>
                      <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)]`}>Direction</TableHead>
                      <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)]`}>Location</TableHead>
                      <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)]`}>Action</TableHead>
                    </TableRow>
                    <TableRow className={styles.tableRow}>
                      <TableCell className={`${styles.tableCell} ${styles.tableCellIndex}`}></TableCell>
                      <TableCell className={`${styles.tableCell} ${styles.tableCellId}`}>
                        <Input id="IdFilter"
                          placeholder="Search ID..."
                          value={searchID}
                          onChange={(e) => setSearchID(e.target.value)}
                          className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                        />
                      </TableCell>
                      <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>
                        <Select id="levelFilter"
                          placeholder="All Levels"
                          value={searchLevel}
                          onChange={(e) => setSearchLevel(e.target.value)}
                          options={levels}
                          className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                        />
                      </TableCell>
                      <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>
                        <Select id="directionFilter"
                          placeholder="All Directions"
                          value={searchDirection}
                          onChange={(e) => setSearchDirection(e.target.value)}
                          options={directions}
                          className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                        />
                      </TableCell>
                      <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>
                        <Select 
                          placeholder="All Locations"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          options={locations}
                          className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                        />
                      </TableCell>
                      <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>
                        <Select
                          placeholder="All Actions"
                          value={searchActions}
                          onChange={(e) => setSearchActions(e.target.value)}
                          options={actions}
                          className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                        />
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Body */}
              <div className={styles.tableBody}>
                <Table className={styles.tableContainer}>
                  <TableBody>
                    {filteredChecks.map((check, index) => (
                      <TableRow 
                        key={check.id} 
                        onClick={() => setSelectedCheck(check)} 
                        className={`${styles.tableRow} ${styles.tableRowHover} ${selectedCheck && selectedCheck.id === check.id ? styles.tableRowSelected : ''}`}
                      >
                        <TableCell className={`${styles.tableCell} ${styles.tableCellIndex}`}>{index}</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableCellId}`}>{check.id}</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>{check.level}</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>{check.direction}</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>{check.location}</TableCell>
                        <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>{check.action}</TableCell>
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
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">{selectedCheck.id}</h2>
                <p className="text-[var(--foreground)]"><strong>ID:</strong> {selectedCheck.id}</p>
                <p className="text-[var(--foreground)]"><strong>Level:</strong> {selectedCheck.level}</p>
                <p className="text-[var(--foreground)]"><strong>Direction:</strong> {selectedCheck.direction}</p>
                <p className="text-[var(--foreground)]"><strong>Location:</strong> {selectedCheck.location}</p>
                <p className="text-[var(--foreground)]"><strong>Action:</strong> {selectedCheck.action}</p>
                <p className="mt-4 text-[var(--foreground)]"><strong>Details:</strong> {selectedCheck.detailed_description}</p>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--foreground)]/50">
                <p>Select a check to view details</p>
              </div>
            )}
          </div>
        </div>
      </Card>
  );
}
