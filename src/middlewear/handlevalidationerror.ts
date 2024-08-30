import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  // req.body = JSON.parse(req.body);
  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(400).json({ errors: errors.array() });
  }



  
  next();  






};
export { handleValidationErrors };
