export const capitaliseWords = (phrase) => {
    if (!phrase) return '';
    return phrase.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const extractCategory = (fullphraseing) => {
    const [category] = fullphraseing.split(':');
    return category.trim();
}

export const extractSubcategory = (fullphraseing) => {
    const parts = fullphraseing.split(':');
    return parts[1] ? parts[1].trim() : null;
}
