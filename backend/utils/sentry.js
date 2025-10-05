const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

// Initialize Sentry if DSN is provided
const initializeSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        // Add profiling integration
        nodeProfilingIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in production, 100% in development
      // Release Health
      enableTracing: true,
      // Set profiling sample rate
      profilesSampleRate: 1.0,
    });

    console.log('✅ Sentry error monitoring initialized');
  } else {
    console.log('⚠️ Sentry DSN not configured - error monitoring disabled');
  }
};

// Error handler middleware
const sentryErrorHandler = (err, req, res, next) => {
  // Log error to Sentry if configured
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Continue with normal error handling
  next(err);
};

// Request handler for performance monitoring
const sentryRequestHandler = Sentry.setupExpressErrorHandler;

module.exports = {
  initializeSentry,
  sentryErrorHandler,
  sentryRequestHandler
};