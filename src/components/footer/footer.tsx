import styles from "./footer.module.css";

type FooterProps = {
    text?: string;
    ownerName?: string;
    ownerLink?: string;
};

function Footer({ text = "Portfolio by", ownerName = "Ajaya Rajbhandari", ownerLink = "https://github.com/Ajaya-Rajbhandari" }: FooterProps) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.text}>
                    © {new Date().getFullYear()} {text}{" "}
                    {ownerLink ? (
                        <a href={ownerLink} target="_blank" rel="noopener noreferrer">{ownerName}</a>
                    ) : (
                        <span>{ownerName}</span>
                    )}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
