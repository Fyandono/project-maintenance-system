import React from "react";
import {formatDate} from "../../../core/utils/formatDate";
import styles from "./VendorDetail.module.css";

const VendorDetail = ({data}) => {
	if (!data) return <p>No detail available</p>;

	return (
		<div className={styles.container}>
			<div className={styles.titleWrapper}>
				<h2 className={styles.title}>Vendor Detail</h2>
			</div>

			<div className={styles.content}>
				<div className={styles.row}>
					<span className={styles.label}>Name</span>
					<span className={styles.value}>{data.name}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Address</span>
					<span className={styles.value}>{data.address}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Email</span>
					<span className={styles.value}>{data.email}</span>
				</div>

				<div className={styles.row}>
					<span className={styles.label}>Phone Number</span>
					<span className={styles.value}>{data.phone_number}</span>
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

export default VendorDetail;
