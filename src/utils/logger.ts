// import { createLogger, transports, format } from "winston";


// const logger = createLogger({
//     transports: [new transports.Console(), new transports.File({ filename: 'error.log', level: 'error' }), new transports.File({ filename: 'combined.log' })],
//     format: format.combine(
//       format.colorize(),
//       format.timestamp(),
//       format.printf(({ timestamp, level, message, service }) => {
//         return `[${timestamp}] ${level}: ${message} (${service})`;
//       })
//     ),  
//     defaultMeta: { service: 'biconomyMultiChainSDK' },
// });
  
// export default logger;