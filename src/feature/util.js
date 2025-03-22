import { format } from "date-fns";
import { fr } from "date-fns/locale";
import domtoimage from "dom-to-image";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
export class ExcelExportService {
    constructor() {
        this.workbook = new ExcelJS.Workbook();
        this.workbook.creator = "TrouveChap";
        this.workbook.lastModifiedBy = "TrouveChap";
        this.workbook.created = new Date();
        this.workbook.modified = new Date();
    }

    /**
     * Calcule les dimensions de l'image en préservant l'aspect ratio
     * @param {number} originalWidth - Largeur originale
     * @param {number} originalHeight - Hauteur originale
     * @param {number} maxWidth - Largeur maximale souhaitée
     * @returns {Object} Nouvelles dimensions
     */
    calculateImageDimensions(originalWidth, originalHeight, maxWidth) {
        const aspectRatio = originalWidth / originalHeight;
        const newWidth = maxWidth;
        const newHeight = maxWidth / aspectRatio;
        return { width: newWidth, height: newHeight };
    }

    /**
     * Obtient les dimensions réelles de l'image
     * @param {string} imageUrl - URL de l'image
     * @returns {Promise<Object>} Dimensions de l'image
     */
    async getImageDimensions(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                });
            };
            img.onerror = reject;
            img.src = imageUrl;
        });
    }

    /**
     * Crée une feuille de calcul avec style et formatage
     * @param {Array} data - Données à exporter [{key, value}]
     * @param {string} title - Titre de l'export
     * @param {string} elementId - ID de l'élément HTML à capturer (optionnel)
     * @param {Object} imageOptions - Options pour l'image (optionnel)
     */
    async generateSheet(
        data,
        title,
        elementId = null,
        imageOptions = { maxWidth: 600 },
        options = {},
        header = ["Indicateur", "Valeur"]
    ) {
        const worksheet = this.workbook.addWorksheet(title, {
            pageSetup: { paperSize: 9, orientation: "portrait" },
            properties: { tabColor: { argb: "6366F1" } },
        });

        // Configuration des colonnes avec plus de largeur et de flexibilité
        worksheet.columns = [
            { header: header[0], key: "key", width: 25 },
            {
                header: header[1],
                key: "value",
                width: 15,
                alignment: { horizontal: "right" },
            },
        ];

        // Titre principal
        worksheet.mergeCells("A1:B1");
        const titleCell = worksheet.getCell("A1");
        titleCell.value = title;
        titleCell.font = {
            name: "Calibri",
            size: 18,
            bold: true,
            color: { argb: "1E40AF" }, // Bleu profond
        };
        titleCell.alignment = { vertical: "middle", horizontal: "center" };
        worksheet.getRow(1).height = 35;

        // Sous-titre avec informations supplémentaires
        worksheet.mergeCells("A2:B2");
        const subtitleCell = worksheet.getCell("A2");
        subtitleCell.value =
            options.subtitle ||
            `Export du ${format(new Date(), "dd MMMM yyyy", { locale: fr })}`;
        subtitleCell.font = {
            name: "Calibri",
            size: 11,
            color: { argb: "4B5563" }, // Gris foncé
        };
        subtitleCell.alignment = { vertical: "middle", horizontal: "center" };

        // En-tête des colonnes avec style amélioré
        const headerRow = worksheet.getRow(4);
        headerRow.values = header;
        headerRow.font = {
            name: "Calibri",
            bold: true,
            size: 12,
            color: { argb: "FFFFFF" },
        };

        // Appliquer le remplissage uniquement aux cellules A4 et B4
        const cellA4 = worksheet.getCell("A4");
        const cellB4 = worksheet.getCell("B4");

        cellA4.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "3B82F6" }, // Bleu vif
        };

        cellB4.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "3B82F6" }, // Bleu vif
        };

        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.height = 30;

        // Ajout des données avec style amélioré
        data.forEach((item, index) => {
            let displayValue = item.value;
            let afterValue = "";

            // Vérifier si options.aftervalue existe et ajouter un texte conditionnel
            if (options.aftervalue) {
                afterValue = ` ${item.value > 1 ? options.aftervalue2 : options.aftervalue
                    }`;
                displayValue = `${item.value}`;
            }

            const row = worksheet.addRow([item.key, displayValue + afterValue]);
            row.height = 25;

            // Style alternatif pour les lignes
            row.eachCell((cell, colNumber) => {
                cell.font = {
                    name: "Calibri",
                    size: 11,
                    color: { argb: "1F2937" }, // Gris très foncé
                };

                cell.alignment = {
                    vertical: "middle",
                    horizontal: colNumber === 2 ? "right" : "left",
                };

                // Bordures subtiles
                cell.border = {
                    bottom: { style: "thin", color: { argb: "E5E7EB" } },
                };

                // Alternance de couleur de fond
                if (index % 2 === 0) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "F3F4F6" }, // Gris très clair
                    };
                }

                // Définir le type de la colonne de valeur comme numérique si pas d'aftervalue
                if (colNumber === 2) {
                    if (!options.aftervalue) {
                        cell.numFmt = "0"; // Format numérique entier
                    }

                    // Ajouter le texte après la valeur si présent
                    if (options.aftervalue) {
                        cell.value = {
                            richText: [
                                {
                                    text: item.value,
                                    font: {
                                        name: "Calibri",
                                        size: 11,
                                    },
                                },
                                {
                                    text: ` ${item.value > 1 ? options.aftervalue2 : options.aftervalue
                                        }`,
                                    font: {
                                        name: "Calibri",
                                        size: 11,
                                        color: { argb: "6B7280" }, // Gris pour le texte supplémentaire
                                    },
                                },
                            ],
                        };
                    }
                }
            });
        });

        // Ajout de la capture d'écran si un elementId est fourni
        if (elementId) {
            try {
                const element = document.getElementById(elementId);
                if (element) {
                    const dataUrl = await domtoimage.toPng(element);
                    const blob = await fetch(dataUrl).then((res) => res.blob());
                    const arrayBuffer = await blob.arrayBuffer();

                    const rect = element.getBoundingClientRect();
                    const newDimensions = this.calculateImageDimensions(
                        rect.width,
                        rect.height,
                        imageOptions.maxWidth
                    );

                    const imageId = this.workbook.addImage({
                        buffer: arrayBuffer,
                        extension: "png",
                    });

                    const lastRow = worksheet.lastRow.number + 2;
                    worksheet.addImage(imageId, {
                        tl: { col: 0, row: lastRow },
                        ext: {
                            width: newDimensions.width,
                            height: newDimensions.height,
                        },
                    });
                }
            } catch (error) {
                console.warn("Impossible de capturer l'élément:", error);
            }
        }

        return worksheet;
    }

    async export(filename) {
        const buffer = await this.workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${filename}_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    }
}