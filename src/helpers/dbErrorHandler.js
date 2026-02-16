'use strict';

/**
 * Get unique error field name
 */
const uniqueMessage = (error) => {
  let output;
  try {
    const fieldName = error.keyValue ? Object.keys(error.keyValue)[0] : 'field';
    output = `${fieldName} already exists`;
  } catch (ex) {
    output = 'Unique field already exists';
  }
  return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = (error) => {
  let message = '';
  if (error.code && (error.code === 11000 || error.code === 11001)) {
    message = uniqueMessage(error);
  } else {
    for (let errorName in error.errors) {
      if (error.errors[errorName].message)
        message = error.errors[errorName].message;
    }
  }
  return message || 'An error occurred';
};
