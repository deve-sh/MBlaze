export const ARRAY_UNION_TYPE = "$MBlaze.arrayUnion";
export const ARRAY_UNION_OP_CODE = "$addToSet";

const arrayUnion = (field: string, toAdd: any) => ({ [field]: toAdd });

export default arrayUnion;
