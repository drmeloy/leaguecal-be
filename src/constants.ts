export const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

const mongoPW = process.env.MONGO_PASSWORD;
export const mongoURI = `mongodb+srv://drmeloy:${mongoPW}@leaguecal.f9nbvhw.mongodb.net/?retryWrites=true&w=majority`