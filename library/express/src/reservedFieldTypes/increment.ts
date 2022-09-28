export const INCREMENT_TYPE = "$MBlaze.increment";
export const INCREMENT_OP_CODE = "$inc";

const increment = (field: string, by: number) => ({ [field]: by });

export default increment;
