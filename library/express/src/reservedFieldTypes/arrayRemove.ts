export const ARRAY_REMOVE_TYPE = "$MBlaze.arrayRemove";
export const ARRAY_REMOVE_OP_CODE = "$pull";

const arrayRemove = (field: string, toRemove: any) => ({ [field]: toRemove });

export default arrayRemove;
