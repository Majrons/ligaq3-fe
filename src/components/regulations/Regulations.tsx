import React from 'react';
import styles from './Regulations.module.scss';
import { useIsMobileView } from '../hooks/useIsInMobileView';

const Regulations: React.FC = () => {
    const isMobileView = useIsMobileView();
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

    const imagePreviewRef = React.useRef<HTMLDivElement | null>(null); // Referencja do elementu podglądu obrazu

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

    return (
        <div className={styles.container}>
            <h2>
                LIGA KWARTAŁÓW,
                <br /> EDYCJA DRUGA - REGULAMIN
            </h2>
            <p className={styles.containerParagraph}>
                ZAPISY OGÓLNE:
                <ul>
                    <li>by mecz się wliczał gramy minimum 2v2; rywalizacje 1v1 nie będą kwalifikowane</li>
                    <li>
                        by zwyciężyć w całym spotkaniu należy wygrać dwie mapy, które wybierają rywalizujące
                        zespoły(zasada "jedna nasza, jedna wasza"); w przypadku remisu rozgrywana jest dogrywka na
                        odpowiedniej mapie(więcej o wyborze trzeciej mapy poniżej){' '}
                    </li>
                    <li>gramy albo iTDM albo iCTF</li>
                    <li>do ustalenia przed meczem, nie można mieszać trybów gry w jednym spotkaniu;</li>
                    <li>ustawienia serwera: iCTF timelimit 10, capturelimit 0; iTDM timelimit 10, fraglimit 0</li>
                    <li>wyłonienie zwycięzcy a zarazem koniec ligi 31.03.2025</li>
                </ul>
            </p>
            <p className={styles.containerParagraph}>
                TABELA WYNIKÓW: <br />
                <br /> Punktacja w tabeli na zasadzie procentowego stosunku zwycięstw do rozegranych meczy.
                <br /> Przykład: <br />
                drużyna ma 8 meczy w tym 6 winów = 75%. Aby jednak drużyna w ogóle kwalifikowana była do tabeli musi
                mieć rozegranych minimum 70% średniej meczów przypadających na drużynę. <br />
                Przykład:
                <br />
                TEAM 01 - bilans 24-20 czyli 48 meczy / 55% winów <br />
                TEAM 02 - bilans 27-16 czyli 43 mecze / 63% winów <br />
                TEAM 03 - bilans 19-6 czyli 25 mecze / 76% winów <br />
                Wszystkich meczy 116, średnio 39 na drużynę, 70% z tego to 27. <br />
                Teoretycznie TEAM 03 powinien wygrać ligę, ale rozegrał zbyt mało spotkań by się kwalifikować.
            </p>
            <p className={styles.containerParagraph}>
                DOBÓR MAPY DOGRYWKOWEJ: <br />
                Jeżeli nie możemy się dogadać co do mapy wspólnej wybieramy ją z przedstawionych poniżej na zasadzie
                kolejnego eliminowania map aż zostanie się jedna na której odbędzie się rywalizacja. Jako pierwsza mapę
                odrzuca drużyna, która wygrała drugą mapę.
            </p>
            <div className={styles.containerTable}>
                <table border={1}>
                    <tbody>
                        <tr>
                            <td colSpan={4} className={styles.containerRowCollapsed}>
                                LISTA MAP iCTF
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
                                LISTA MAP iTDM
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4} className={styles.containerItdmList}>
                                zakres granych map jest tak wąski, że ciężko się nie dogadac o mapę wspólną skoro
                                wszystkie drużyny znają ich zaledwie kilka
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className={styles.containerInfo}>KOMISJA KONTROLI GIER I ZAKŁADÓW LICZBOWYCH, 06.01.2025</p>
            <div ref={imagePreviewRef} className={styles.containerImagePreview} id="image-preview"></div>
        </div>
    );
};

export default Regulations;
