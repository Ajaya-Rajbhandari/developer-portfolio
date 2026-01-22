import styles from "./footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.text}>
                    © {new Date().getFullYear()} Portfolio by <a href="https://github.com/Ajaya-Rajbhandari" target="_blank" rel="noopener noreferrer">Ajaya Rajbhandari</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
