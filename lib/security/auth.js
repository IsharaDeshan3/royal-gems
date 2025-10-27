"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileSize =
  exports.generateSecureFilename =
  exports.validateFileType =
  exports.createRateLimitKey =
  exports.escapeHtml =
  exports.sanitizeInput =
  exports.verifyCSRFToken =
  exports.generateCSRFToken =
  exports.verify2FAToken =
  exports.generateQRCode =
  exports.generate2FASecret =
  exports.generatePasswordResetToken =
  exports.verifyToken =
  exports.generateTokens =
  exports.validatePasswordStrength =
  exports.verifyPassword =
  exports.hashPassword =
    void 0;
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import crypto from "crypto";

var bcryptjs_1 = bcrypt;
var jsonwebtoken_1 = jsonwebtoken;
var speakeasy_1 = speakeasy;
var qrcode_1 = qrcode;
var crypto_1 = crypto;
var JWT_SECRET = process.env.JWT_SECRET;
var JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
var BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12");
// Password utilities
var hashPassword = function (password) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, bcryptjs_1.default.hash(password, BCRYPT_ROUNDS)];
    });
  });
};
exports.hashPassword = hashPassword;
var verifyPassword = function (password, hash) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, bcryptjs_1.default.compare(password, hash)];
    });
  });
};
exports.verifyPassword = verifyPassword;
var validatePasswordStrength = function (password) {
  var errors = [];
  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};
exports.validatePasswordStrength = validatePasswordStrength;
// JWT utilities
var generateTokens = function (payload) {
  var accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
  var refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken: accessToken, refreshToken: refreshToken };
};
exports.generateTokens = generateTokens;
var verifyToken = function (token, isRefreshToken) {
  if (isRefreshToken === void 0) {
    isRefreshToken = false;
  }
  try {
    var secret = isRefreshToken ? JWT_REFRESH_SECRET : JWT_SECRET;
    return jsonwebtoken_1.default.verify(token, secret);
  } catch (error) {
    return null;
  }
};
exports.verifyToken = verifyToken;
var generatePasswordResetToken = function () {
  return crypto_1.default.randomBytes(32).toString("hex");
};
exports.generatePasswordResetToken = generatePasswordResetToken;
// 2FA utilities
var generate2FASecret = function (email) {
  var secret = speakeasy_1.default.generateSecret({
    name: "Royal Gems Institute (".concat(email, ")"),
    issuer: "Royal Gems Institute",
    length: 32,
  });
  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};
exports.generate2FASecret = generate2FASecret;
var generateQRCode = function (otpauthUrl) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, qrcode_1.default.toDataURL(otpauthUrl)];
    });
  });
};
exports.generateQRCode = generateQRCode;
var verify2FAToken = function (token, secret) {
  return speakeasy_1.default.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 2,
  });
};
exports.verify2FAToken = verify2FAToken;
// CSRF utilities
var generateCSRFToken = function () {
  return crypto_1.default.randomBytes(32).toString("hex");
};
exports.generateCSRFToken = generateCSRFToken;
var verifyCSRFToken = function (token, sessionToken) {
  return token === sessionToken;
};
exports.verifyCSRFToken = verifyCSRFToken;
// Input sanitization
var sanitizeInput = function (input) {
  return input
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};
exports.sanitizeInput = sanitizeInput;
var escapeHtml = function (unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
exports.escapeHtml = escapeHtml;
// Rate limiting utilities
var createRateLimitKey = function (ip, action) {
  return "rate_limit:".concat(action, ":").concat(ip);
};
exports.createRateLimitKey = createRateLimitKey;
// File upload security
var validateFileType = function (mimeType, allowedTypes) {
  return allowedTypes.includes(mimeType);
};
exports.validateFileType = validateFileType;
var generateSecureFilename = function (originalName) {
  var ext = originalName.split(".").pop();
  var randomName = crypto_1.default.randomBytes(16).toString("hex");
  return "".concat(randomName, ".").concat(ext);
};
exports.generateSecureFilename = generateSecureFilename;
var validateFileSize = function (size, maxSize) {
  return size <= maxSize;
};
exports.validateFileSize = validateFileSize;
