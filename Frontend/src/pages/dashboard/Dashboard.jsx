import styles from "./Dashboard.module.css";
import { BrandHeader } from "../../components/ui/SmallComponents";
import logo from "../../assets/images/logo.svg";

import { FiHome, FiFolder, FiShare2, FiStar, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useState } from "react";

export default function Dashboard({ notify }) {


    const [toggleSettings, setToggleSettings] = useState(false);



    return (
        <div className={styles.mainContainer}>



            <div className={styles.sideBar}>

                <div className={styles.brandHeader}>

                    <img src={logo} />
                    <h1>SNIPR</h1>

                </div>

                <div className={styles.options}>

                    <button className={styles.optionRow}>
                        <FiFolder className={styles.optionIcon} />
                        <p className={styles.optionText}>My Files</p>
                    </button>

                    <button className={styles.optionRow}>
                        <FiShare2 className={styles.optionIcon} />
                        <p className={styles.optionText}>Shared Files</p>
                    </button>


                    <button className={styles.optionRow}>
                        <FiStar className={styles.optionIcon} />
                        <p className={styles.optionText}>Starred</p>
                    </button>


                </div>



                <div className={styles.accountContainer}>


                    <div className={`${styles.accountSettings} ${toggleSettings ? styles.show : " "}`}>
                        <button> Change Password</button>
                           <button> Change Email</button>
                              <button> Delete Account</button>
                    </div>


                    <div className={styles.accountRow}>

                        <div className={styles.accountDetails}>
                            <p className = {styles.accountName}>Account name</p>
                            <p className = {styles.accountEmail}>email@gmail.com</p>
                        </div>


                        <div className={styles.accountArrowIcons}
                        onClick={() => setToggleSettings(!(toggleSettings))}>
                            <FiChevronUp />
                            <FiChevronDown />
                        </div>
                    </div>


                </div>

            </div>



            <div className={styles.mainContent}>

            </div>


        </div>



    )
}