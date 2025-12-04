import React from "react";
import {formatDate} from "../../../core/utils/formatDate";
import styles from "./ProjectDetail.module.css";

const ProjectDetail = ({data}) => {
	if (!data) return <p>No detail available</p>;

	return (
		<div className={styles.container}>
			<div className={styles.titleWrapper}>
				<h2 className={styles.title}>Project Detail</h2>
			</div>

			<div className={styles.content}>
				<div className={styles.row}>
					<span className={styles.label}>Name</span>
					<span className={styles.value}>{data.name}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Description</span>
					<span className={styles.value}>{data.description}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Project Type</span>
					<span className={styles.value}>{data.project_type}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Vendor Name</span>
					<span className={styles.value}>{data.vendor_name}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>PIC Name</span>
					<span className={styles.value}>{data.pic_name}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>PIC Email</span>
					<span className={styles.value}>{data.pic_email}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>PIC Unit</span>
					<span className={styles.value}>{data.pic_unit}</span>
				</div>
                
				<div className={styles.row}>
					<span className={styles.label}>PM Uploaded</span>
					<span className={styles.value}>{data.count_pm_uploaded}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>PM Verified</span>
					<span className={styles.value}>{data.count_pm_verified}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>PM Unverified</span>
					<span className={styles.value}>{data.count_pm_unverified}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Created At</span>
					<span className={styles.value}>{formatDate(data.created_at)}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Created By</span>
					<span className={styles.value}>{data.created_by}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Updated At</span>
					<span className={styles.value}>{data.updated_at ? formatDate(data.updated_at) : "-"}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Updated By</span>
					<span className={styles.value}>{data.updated_by || "-"}</span>
				</div>
			</div>

			{/* <div className={styles.row}>
        <span className={styles.label}>Vendor ID</span>
        <span className={styles.value}>{data.vendor_id}</span>
      </div> */}
		</div>
	);
};

export default ProjectDetail;
