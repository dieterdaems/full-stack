import { useRouter } from "next/router";

const Language: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;


    const handleLanguageChange = (event: { target: { value: string}}) => {
        const newLocale = event.target.value;
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    }

    return (
        <div className="language">
            <label htmlFor="language"></label>
            <select className='bg-gray-100' name="language" id="language" value={locale} onChange={handleLanguageChange}>
                <option value="en">🇬🇧</option>
                <option value="nl">🇳🇱</option>
            </select>
        </div>
    );
    };

export default Language;