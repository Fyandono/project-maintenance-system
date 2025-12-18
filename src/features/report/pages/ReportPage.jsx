import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter as setReportFilter, fetchVendorsThunk, fetchReportThunk } from "../reportSlice"; 
import styles from "./ReportPage.module.css";
import StatusBanner from "../../../core/components/StatusBanner";

export default function ReportPage() {
    const dispatch = useDispatch();

    // 1. SELECTORS: Pull state from the 'reports' slice
    const { 
        vendors = [], 
        vendorsLoading,
        filterListVendorId, 
        filterProjectStartDate, 
        filterProjectEndDate, 
		filterCompletionStartDate, 
        filterCompletionEndDate, 
        filterPMType, 
        filterPMStatus,
        isLoading // Global loading state for the download thunk
    } = useSelector((state) => state.reports || {});

    const [searchTerm, setSearchTerm] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState(null);

    const pmTypes = ["Data", "Change Request", "Incident", "Bugs Fixing", "New Project", "Maintenance", "Other"];
    const statusTypes = ["On Progress", "Verified", "Need Revision"];

    // 2. STICKY FETCH: Ensure vendor list is fetched once
    const hasFetched = useRef(false);
    useEffect(() => {
        if (!hasFetched.current) {
            dispatch(fetchVendorsThunk());
            hasFetched.current = true;
        }
    }, [dispatch]);

    // 3. FILTERS OBJECT: Using useMemo to mirror your PMPage structure
    const filters = useMemo(
        () => ({
            list_vendor_id: filterListVendorId || '',
            project_start_date: filterProjectStartDate || '',
            project_end_date: filterProjectEndDate || '',
			completion_start_date: filterCompletionStartDate || '',
            completion_end_date: filterCompletionEndDate || '',
            pm_type: filterPMType || '',
            pm_status: filterPMStatus || ''
        }),
        [filterListVendorId, filterProjectStartDate, filterProjectEndDate, filterCompletionStartDate, filterCompletionEndDate, filterPMType, filterPMStatus]
    );

    // 4. HANDLERS
    const filteredVendors = vendors.filter((vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFilterChange = (name, value) => {
        dispatch(setReportFilter({ name, value }));
    };

    const handleVendorCheckboxChange = (vendorId) => {
        let currentIds = filterListVendorId ? filterListVendorId.split(',').filter(x => x).map(Number) : [];
        if (currentIds.includes(vendorId)) {
            currentIds = currentIds.filter(id => id !== vendorId);
        } else {
            currentIds.push(vendorId);
        }
        dispatch(setReportFilter({ name: 'filterListVendorId', value: currentIds.join(',') }));
    };

    const handleDownloadReport = () => {
        setSubmissionMessage(null);
        // Dispatch the thunk using the memoized filters object
        dispatch(fetchReportThunk(filters))
            .unwrap()
            .then(() => {
                setSubmissionStatus("success");
                setSubmissionMessage("Report generation started successfully.");
            })
            .catch((err) => {
                setSubmissionStatus("failure");
                setSubmissionMessage(err || "Failed to generate report.");
            });
    };

    return (
        <div className={styles.reportContainer}>
            <div className={styles.header}>
                <h2>Report Project Monitor</h2>
            </div>

            <StatusBanner message={submissionMessage} type={submissionStatus} onClose={() => setSubmissionMessage(null)} />

            <div className={styles.filterCard}>
                <div className={styles.filterGrid}>
                    
                    {/* VENDOR SIDEBAR */}
                    <div className={styles.filterGroup}>
                        <label className={styles.label}>Vendors</label>
                        <input 
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className={styles.checkboxList}>
                            {vendorsLoading ? (
                                <div className={styles.loadingText}>Loading...</div>
                            ) : filteredVendors.length > 0 ? (
                                filteredVendors.map(vendor => (
                                    <label key={vendor.id} className={styles.checkboxItem}>
                                        <input 
                                            type="checkbox"
                                            checked={filterListVendorId?.split(',').includes(vendor.id.toString())}
                                            onChange={() => handleVendorCheckboxChange(vendor.id)}
                                        />
                                        <span>{vendor.name}</span>
                                    </label>
                                ))
                            ) : (
                                <div className={styles.loadingText}>No vendors found</div>
                            )}
                        </div>
                    </div>

                    {/* DATES & DROPDOWNS */}
                    <div className={styles.controlsGrid}>
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Start Date</label>
                            <input 
                                type="date" 
                                className={styles.input}
                                value={filterProjectStartDate || ''} 
                                onChange={(e) => handleFilterChange('filterProjectStartDate', e.target.value)}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.label}>End Date</label>
                            <input 
                                type="date" 
                                className={styles.input}
                                value={filterProjectEndDate || ''} 
                                onChange={(e) => handleFilterChange('filterProjectEndDate', e.target.value)}
                            />
                        </div>

						<div className={styles.filterGroup}>
                            <label className={styles.label}>Start Date</label>
                            <input 
                                type="date" 
                                className={styles.input}
                                value={filterCompletionStartDate || ''} 
                                onChange={(e) => handleFilterChange('filterCompletionStartDate', e.target.value)}
                            />
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.label}>End Date</label>
                            <input 
                                type="date" 
                                className={styles.input}
                                value={filterCompletionEndDate || ''} 
                                onChange={(e) => handleFilterChange('filterCompletionEndDate', e.target.value)}
                            />
                        </div>


                        <div className={styles.filterGroup}>
                            <label className={styles.label}>PM Type</label>
                            <select 
                                className={styles.select}
                                value={filterPMType || ''} 
                                onChange={(e) => handleFilterChange('filterPMType', e.target.value)}
                            >
                                <option value="">All Types</option>
                                {pmTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Status</label>
                            <select 
                                className={styles.select}
                                value={filterPMStatus || ''} 
                                onChange={(e) => handleFilterChange('filterPMStatus', e.target.value)}
                            >
                                <option value="">All Status</option>
                                {statusTypes.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button 
                        type="button" 
                        className={styles.downloadButton} 
                        onClick={handleDownloadReport}
                        disabled={isLoading}
                    >
                        {isLoading ? "Generating..." : "Download Report"}
                    </button>
                </div>
            </div>
        </div>
    );
}