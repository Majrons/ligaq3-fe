import React from 'react';
import styles from './Regulations.module.scss';
import { useIsMobileView } from '../hooks/useIsInMobileView';
import classnames from 'classnames';

const Regulations: React.FC = () => {
    const isMobileView = useIsMobileView();
    const [language, setLanguage] = React.useState<'pl' | 'en'>('pl');

    const imagePath = (mapName: string) => `https://liga-q3.pl/mapy/${mapName}.jpg`;
    const map = {
        dividedcrossings: 'dividedcrossings',
        divineintermission: 'divineintermission',
        duelingkeeps: 'duelingkeeps',
        futurecrossings: 'futurecrossings',
        railyard: 'railyard',
        q3w4: 'q3w4',
        q3wcp10: 'q3wcp10',
        courtyard: 'courtyard',
        japanesecastles: 'japanesecastles',
        shiningforces: 'shiningforces',
        spidercrossings: 'spidercrossings',
        industrialrevolution: 'industrialrevolution',
    };

    const imagePreviewRef = React.useRef<HTMLDivElement | null>(null);
    const tableRefObject = React.useRef<HTMLDivElement | null>(null);

    const handleBlur = () => {
        if (imagePreviewRef.current) {
            imagePreviewRef.current.style.display = 'none';
        }
    };

    React.useEffect(() => {
        const cells = document.querySelectorAll<HTMLTableCellElement>('td[data-img]');

        const handleMouseEnter = (cell: HTMLTableCellElement) => {
            const imgUrl = cell.getAttribute('data-img');
            if (imagePreviewRef.current && imgUrl) {
                imagePreviewRef.current.style.backgroundImage = `url(${imgUrl})`;
                imagePreviewRef.current.style.display = 'block';
            }
        };

        const handleMouseLeave = () => {
            if (imagePreviewRef.current) {
                imagePreviewRef.current.style.display = 'none';
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (imagePreviewRef.current) {
                const offsetX = 15;
                const offsetY = 15;
                imagePreviewRef.current.style.left = `${e.pageX + offsetX}px`;
                imagePreviewRef.current.style.top = `${e.pageY - imagePreviewRef.current.offsetHeight - offsetY}px`;
            }
        };

        const handleMobileMouseMove = () => {
            if (imagePreviewRef.current && tableRefObject.current) {
                const offsetX = 25;
                const offsetY = 15;
                imagePreviewRef.current.style.left = `${offsetX}px`;
                imagePreviewRef.current.style.top = `${tableRefObject.current.offsetTop - imagePreviewRef.current.offsetHeight - offsetY}px`;
            }
        };

        const handleClick = (cell: HTMLTableCellElement) => {
            const imgUrl = cell.getAttribute('data-img');
            if (imagePreviewRef.current && imgUrl) {
                imagePreviewRef.current.style.backgroundImage = `url(${imgUrl})`;
                imagePreviewRef.current.style.display = 'block';
            }
        };

        if (isMobileView) {
            cells.forEach(cell => {
                cell.addEventListener('click', () => handleClick(cell));
                cell.addEventListener('mousemove', handleMobileMouseMove);
            });
        } else {
            cells.forEach(cell => {
                cell.addEventListener('mouseenter', () => handleMouseEnter(cell));
                cell.addEventListener('mouseleave', handleMouseLeave);
                cell.addEventListener('mousemove', handleMouseMove);
            });
        }

        return () => {
            cells.forEach(cell => {
                cell.removeEventListener('mouseenter', () => handleMouseEnter(cell));
                cell.removeEventListener('mouseleave', handleMouseLeave);
                cell.removeEventListener('mousemove', handleMouseMove);
            });
        };
    }, [isMobileView]);

    const translations = {
        pl: {
            title: (
                <>
                    LIGA KWARTAŁÓW,
                    <br /> EDYCJA DRUGA - REGULAMIN
                </>
            ),
            generalRules: 'ZAPISY OGÓLNE:',
            rulesList: [
                'by mecz się wliczał gramy minimum 2v2; rywalizacje 1v1 nie będą kwalifikowane',
                "by zwyciężyć w całym spotkaniu należy wygrać dwie mapy, które wybierają rywalizujące zespoły (zasada 'jedna nasza, jedna wasza'); w przypadku remisu rozgrywana jest dogrywka na odpowiedniej mapie (więcej o wyborze trzeciej mapy poniżej)",
                'gramy albo iTDM albo iCTF',
                'do ustalenia przed meczem, nie można mieszać trybów gry w jednym spotkaniu;',
                'ustawienia serwera: iCTF timelimit 10, capturelimit 0; iTDM timelimit 10, fraglimit 0',
                'wyłonienie zwycięzcy a zarazem koniec ligi 31.03.2025',
            ],
            scoreTableTitle: 'TABELA WYNIKÓW:',
            scoreTableText: (
                <>
                    Punktacja w tabeli na zasadzie procentowego stosunku zwycięstw do rozegranych meczy.
                    <br />
                    <br />
                    Przykład: <br />
                    drużyna ma 8 meczy w tym 6 winów = 75%. Aby jednak drużyna w ogóle kwalifikowana była do tabeli musi
                    mieć rozegranych minimum 70% średniej meczów przypadających na drużynę.
                    <br />
                    Przykład:
                    <br />
                    TEAM 01 - bilans 24-20 czyli 48 meczy / 55% winów <br />
                    TEAM 02 - bilans 27-16 czyli 43 mecze / 63% winów <br />
                    TEAM 03 - bilans 19-6 czyli 25 mecze / 76% winów <br />
                    Wszystkich meczy 116, średnio 39 na drużynę, 70% z tego to 27.
                    <br />
                    Teoretycznie TEAM 03 powinien wygrać ligę, ale rozegrał zbyt mało spotkań by się kwalifikować.
                </>
            ),
            overtimeMapSelectionTitle: 'DOBÓR MAPY DOGRYWKOWEJ:',
            overtimeMapSelectionText:
                'Jeżeli nie możemy się dogadać co do mapy wspólnej wybieramy ją z przedstawionych poniżej na zasadzie kolejnego eliminowania map aż zostanie się jedna na której odbędzie się rywalizacja. Jako pierwsza mapę odrzuca drużyna, która wygrała drugą mapę.',
            ictfMapListTitle: 'LISTA MAP iCTF',
            itdmMapListTitle: 'LISTA MAP iTDM',
            itdmMapListText:
                'zakres granych map jest tak wąski, że ciężko się nie dogadac o mapę wspólną skoro wszystkie drużyny znają ich zaledwie kilka',
            committeeText: 'KOMISJA KONTROLI GIER I ZAKŁADÓW LICZBOWYCH, 06.01.2025',
        },
        en: {
            title: (
                <>
                    QUARTERLEAGUE,
                    <br /> SECOND EDITION - REGULATIONS
                </>
            ),
            generalRules: 'GENERAL RULES:',
            rulesList: [
                'For a match to count, a minimum of 2v2 must be played; 1v1 competitions will not be eligible.',
                "To win the entire match, you must win two maps, which are selected by the competing teams (rule: 'one of ours, one of yours'); in case of a tie, overtime is played on the appropriate map (more on selecting the third map below).",
                'We play either iTDM or iCTF.',
                'To be determined before the match; mixing game modes in a single match is not allowed.',
                'Server settings: iCTF timelimit 10, capturelimit 0; iTDM timelimit 10, fraglimit 0.',
                'Determining the winner, which also marks the end of the league: 31.03.2025.',
            ],
            scoreTableTitle: 'SCORE TABLE:',
            scoreTableText: (
                <>
                    The table's scoring is based on the percentage ratio of wins to played matches.
                    <br />
                    <br />
                    Example: <br />
                    A team has played 8 matches, with 6 wins = 75%. However, in order for the team to be eligible for
                    the table, it must have played at least 70% of the average matches allocated per team.
                    <br />
                    Example:
                    <br />
                    TEAM 01 - record 24-20, i.e. 48 matches / 55% wins <br />
                    TEAM 02 - record 27-16, i.e. 43 matches / 63% wins <br />
                    TEAM 03 - record 19-6, i.e. 25 matches / 76% wins <br />
                    Total matches 116, an average of 39 per team, 70% of that is 27.
                    <br />
                    Theoretically, TEAM 03 should win the league, but it played too few matches to qualify.
                </>
            ),
            overtimeMapSelectionTitle: 'OVERTIME MAP SELECTION:',
            overtimeMapSelectionText:
                'If we cannot agree on a shared map, we choose it from the list below by sequentially eliminating maps until only one remains on which the competition will take place. The team that won the second map eliminates the first map.',
            ictfMapListTitle: 'iCTF MAP LIST',
            itdmMapListTitle: 'iTDM MAP LIST',
            itdmMapListText:
                "The range of maps played is so narrow that it's hard not to agree on a shared map, since all teams are familiar with only a few.",
            committeeText: 'GAMES AND LOTTERY REGULATION COMMITTEE, 06.01.2025',
        },
    };

    return (
        <div className={styles.container}>
            <div className={styles.languageToggle}>
                <button
                    className={classnames(styles.languageToggleButton, {
                        [styles.active]: language === 'pl',
                    })}
                    onClick={() => setLanguage('pl')}>
                    Polski
                </button>
                <button
                    className={classnames(styles.languageToggleButton, {
                        [styles.active]: language === 'en',
                    })}
                    onClick={() => setLanguage('en')}>
                    English
                </button>
            </div>

            <h2>{translations[language].title}</h2>

            <p className={styles.containerParagraph}>
                {translations[language].generalRules}
                <ul>
                    {translations[language].rulesList.map((rule, index) => (
                        <li key={index}>{rule}</li>
                    ))}
                </ul>
            </p>

            <p className={styles.containerParagraph}>
                {translations[language].scoreTableTitle}
                <br />
                <br />
                {translations[language].scoreTableText}
            </p>

            <p className={styles.containerParagraph}>
                {translations[language].overtimeMapSelectionTitle}
                <br />
                {translations[language].overtimeMapSelectionText}
            </p>

            <div ref={tableRefObject} className={styles.containerTable} tabIndex={-1} onBlur={handleBlur}>
                <table border={1}>
                    <tbody>
                        <tr>
                            <td colSpan={4} className={styles.containerRowCollapsed}>
                                {translations[language].ictfMapListTitle}
                            </td>
                        </tr>
                        <tr className={styles.containerTableHeader}>
                            <td>2v2</td>
                            <td>3v3</td>
                            <td>4v4</td>
                            <td>5v5+</td>
                        </tr>
                        <tr>
                            <td data-img={imagePath(map.dividedcrossings)}>{map.dividedcrossings} (q3wcp17)</td>
                            <td data-img={imagePath(map.dividedcrossings)}>{map.dividedcrossings} (q3wcp17)</td>
                            <td data-img={imagePath(map.courtyard)}>{map.courtyard} (q3w2)</td>
                            <td data-img={imagePath(map.courtyard)}>{map.courtyard} (q3w2)</td>
                        </tr>
                        <tr>
                            <td data-img={imagePath(map.divineintermission)}>{map.divineintermission} (q3wxs2)</td>
                            <td data-img={imagePath(map.duelingkeeps)}>{map.duelingkeeps} (q3ctf1)</td>
                            <td data-img={imagePath(map.japanesecastles)}>{map.japanesecastles} (q3wcp1)</td>
                            <td data-img={imagePath(map.japanesecastles)}>{map.japanesecastles} (q3wcp1)</td>
                        </tr>
                        <tr>
                            <td data-img={imagePath(map.duelingkeeps)}>{map.duelingkeeps} (q3ctf1)</td>
                            <td data-img={imagePath(map.futurecrossings)}>{map.futurecrossings} (q3wcp18)</td>
                            <td data-img={imagePath(map.q3w4)}>{map.q3w4}</td>
                            <td data-img={imagePath(map.industrialrevolution)}>{map.industrialrevolution} (q3wcp15)</td>
                        </tr>
                        <tr>
                            <td data-img={imagePath(map.futurecrossings)}>{map.futurecrossings} (q3wcp18)</td>
                            <td data-img={imagePath(map.q3w4)}>{map.q3w4}</td>
                            <td data-img={imagePath(map.shiningforces)}>{map.shiningforces} (q3wcp5)</td>
                            <td data-img={imagePath(map.shiningforces)}>{map.shiningforces} (q3wcp5)</td>
                        </tr>
                        <tr>
                            <td data-img={imagePath(map.railyard)}>{map.railyard} (q3wxs1)</td>
                            <td data-img={imagePath(map.q3wcp10)}>{map.q3wcp10}</td>
                            <td data-img={imagePath(map.spidercrossings)}>{map.spidercrossings} (q3wcp9)</td>
                            <td data-img={imagePath(map.spidercrossings)}>{map.spidercrossings} (q3wcp9)</td>
                        </tr>
                        <tr>
                            <td colSpan={4} className={styles.containerRowCollapsed}>
                                {translations[language].itdmMapListTitle}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4} className={styles.containerItdmList}>
                                {translations[language].itdmMapListText}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className={styles.containerInfo}>{translations[language].committeeText}</p>

            <div ref={imagePreviewRef} className={styles.containerImagePreview} id="image-preview"></div>
        </div>
    );
};

export default Regulations;
