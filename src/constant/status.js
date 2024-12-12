export const statusMap = {
    "waiting": "En Attente",
    "active": "Activé",
    "rejected": "Rejeté",
    "deleted": "Désactivé",
    "accepted": "Acceptée",
    "done": "Terminée",
    "hostPaid": "Hôte Payé",
    "progressing": "En Cours",
    "cancelled": "Annulée",
    "refunded": "Remboursée",
    "planified": "Confirmée",
    "paid": "Payée"
};

export  const getStatusKeyFromValue =(statusValue)=> {
    const inverseStatusMap = Object.fromEntries(
        Object.entries(statusMap).map(([key, value]) => [value, key])
    );

    return inverseStatusMap[statusValue];
}
