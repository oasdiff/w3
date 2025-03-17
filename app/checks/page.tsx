"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import styles from './styles.module.css';

interface Check {
  id: string;
  level: string;
  direction: string;
  location: string;
  action: string;
  detailed_description: string;
  mitigation?: string;
  description?: string;
  number: number;
}

export default function Page() {
  const [searchID, setSearchID] = useState<string>("");
  const [searchLevel, setSearchLevel] = useState<string>("");
  const [searchDirection, setSearchDirection] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [searchActions, setSearchActions] = useState<string>("");
  const [checks, setChecks] = useState<Check[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);

  const levels = [...new Set(checks.map((c) => c.level).filter(Boolean))];
  const directions = [...new Set(checks.map((c) => c.direction).filter(Boolean))];
  const locations = [...new Set(checks.map((c) => c.location).filter(Boolean))];
  const actions = [...new Set(checks.map((c) => c.action).filter(Boolean))];

  useEffect(() => {
    fetch("/data/checks.json")
      .then((res) => res.json())
      .then((data: Check[]) => {
        setChecks(data);
        console.log("Loaded checks:", data);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  const filteredChecks = checks.filter(check =>
    check.id.toLowerCase().includes(searchID.toLowerCase()) &&
    check.level.toLowerCase().includes(searchLevel.toLowerCase()) &&
    check.direction.toLowerCase().includes(searchDirection.toLowerCase()) &&
    check.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
    check.action.toLowerCase().includes(searchActions.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">Checks</h1>
        <p className="text-lg text-[var(--foreground)]/80">
          Browse and search all available oasdiff checks
        </p>
      </div>

      <Card className="bg-[var(--background)] overflow-hidden px-6 pb-6">
        <div className="flex flex-row gap-6 h-full">
          {/* Left side - Table */}
          <div className="w-[calc(100%-24rem)] border border-[var(--background-hover)] rounded-lg overflow-hidden">
            {/* Fixed Header */}
            <div className={styles.tableHeader}>
              <Table className={styles.tableContainer}>
                <TableHeader className="bg-[var(--background-card)] border-b border-[var(--background-hover)]">
                  <TableRow className={styles.tableRow}>
                    <TableHead className={`${styles.tableCell} ${styles.tableCellIndex} text-[var(--foreground)] font-bold`}>#</TableHead>
                    <TableHead className={`${styles.tableCell} ${styles.tableCellId} text-[var(--foreground)] font-bold`}>ID</TableHead>
                    <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)] font-bold`}>Level</TableHead>
                    <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)] font-bold`}>Direction</TableHead>
                    <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)] font-bold`}>Location</TableHead>
                    <TableHead className={`${styles.tableCell} ${styles.tableCellStandard} text-[var(--foreground)] font-bold`}>Action</TableHead>
                  </TableRow>
                  <TableRow className={`${styles.tableRow} bg-[var(--background-card)]`}>
                    <TableCell className={`${styles.tableCell} ${styles.tableCellIndex}`}>&nbsp;</TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.tableCellId}`}>
                      <Input
                        id="IdFilter"
                        placeholder="Search ID..."
                        value={searchID}
                        onChange={(e) => setSearchID(e.target.value)}
                        className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                      />
                    </TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>
                      <Select
                        id="levelFilter"
                        placeholder="All Levels"
                        value={searchLevel}
                        onChange={(e) => setSearchLevel(e.target.value)}
                        options={levels}
                        className="w-full bg-[var(--background-card)] text-[var(--foreground)] border-[var(--background-hover)]"
                      />
                    </TableCell>
                    <TableCell className={`${styles.tableCell} ${styles.tableCellStandard}`}>
                      <Select
                        id="directionFilter"
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
                  {filteredChecks.map((check) => (
                    <TableRow
                      key={check.id}
                      onClick={() => setSelectedCheck(check)}
                      className={`${styles.tableRow} ${styles.tableRowHover} ${selectedCheck && selectedCheck.id === check.id ? styles.tableRowSelected : ''}`}
                    >
                      <TableCell className={`${styles.tableCell} ${styles.tableCellIndex}`}>{check.number}</TableCell>
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
          <div className="w-96 overflow-hidden border border-[var(--background-hover)] rounded-lg">
            {selectedCheck ? (
              <>
                {/* Header section */}
                <div className={styles.tableHeader}>
                  <Table className={styles.tableContainer}>
                    <TableHeader className="bg-[var(--background-card)] border-b border-[var(--background-hover)]">
                      <TableRow className={styles.tableRow}>
                        <TableHead className={`${styles.tableCell} text-[var(--foreground)] font-bold`}>{selectedCheck.id}</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
                {/* Content section */}
                <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 15rem)' }}>
                  <div className="space-y-1">
                    <p className="text-[var(--foreground)] flex">
                      <strong className="w-20">Serial #:</strong>
                      <span>{selectedCheck.number}</span>
                    </p>
                    <p className="text-[var(--foreground)] flex">
                      <strong className="w-20">Level:</strong>
                      <span>{selectedCheck.level}</span>
                    </p>
                    <p className="text-[var(--foreground)] flex">
                      <strong className="w-20">Direction:</strong>
                      <span>{selectedCheck.direction}</span>
                    </p>
                    <p className="text-[var(--foreground)] flex">
                      <strong className="w-20">Location:</strong>
                      <span>{selectedCheck.location}</span>
                    </p>
                    <p className="text-[var(--foreground)] flex">
                      <strong className="w-20">Action:</strong>
                      <span>{selectedCheck.action}</span>
                    </p>
                    {selectedCheck.description && (
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Description</h3>
                        <p className="text-[var(--foreground)]">{selectedCheck.description}</p>
                      </div>
                    )}
                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Details</h3>
                      <p className="text-[var(--foreground)]">{selectedCheck.detailed_description}</p>
                    </div>
                    {selectedCheck.mitigation && (
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2 text-[var(--foreground)]">Mitigation</h3>
                        <p className="text-[var(--foreground)]">{selectedCheck.mitigation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-[var(--foreground)]/50">
                <p>Select a check to view details</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 