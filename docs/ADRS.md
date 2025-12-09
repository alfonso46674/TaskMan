# Architecture Decision Records (ADRs)

## Overview

This document contains Architecture Decision Records (ADRs) for the TaskMan cloud migration project. Each ADR captures a significant architectural decision, the context that led to it, and the consequences of the choice.

---

## ADR-001: Backend Hosting Platform Selection

**Status**: Accepted  
**Date**: 2024-12-09  
**Context**: Need to select a cloud hosting platform for the dockerized Express backend that maintains zero monthly costs.

### Decision
Use **Render.com free tier** for backend hosting.

### Alternatives Considered
| Platform | Pros | Cons | Decision |
|----------|------|------|----------|
| **Render.com** | ✅ True free tier, Docker support, easy deployment | ⚠️ Sleep after inactivity, 512MB RAM limit | ✅ **Selected** |
| Railway | Good developer experience, Git integration | ❌ $5/month after trial, no true free tier | ❌ Rejected |
| Fly.io | Global distribution, good performance | ❌ Requires credit card, complex pricing | ❌ Rejected |
| Heroku | Mature platform, extensive documentation | ❌ No free tier since 2022 | ❌ Rejected |
| Back4App | Docker support, no credit card required | ⚠️ Newer platform, smaller community | 🟡 Backup option |

### Rationale
- **Zero Cost**: Render.com offers a genuine free tier without time limitations
- **Docker Support**: Native Docker container deployment
- **Simplicity**: Straightforward deployment and configuration
- **Reliability**: Established platform with good uptime
- **Sleep Mode**: Acceptable for personal use case (low traffic)

### Consequences
- **Positive**: Zero monthly costs, reliable hosting, easy deployment
- **Negative**: Cold starts after inactivity, memory limitations
- **Mitigation**: Monitor usage, implement health check endpoints, prepare migration path if needed

---

## ADR-002: Database Platform Selection

**Status**: Accepted  
**Date**: 2024-12-09  
**Context**: Need to migrate from local SQLite to cloud database while maintaining zero costs and enabling future features.

### Decision
Use **Supabase PostgreSQL** free tier for cloud database.

### Alternatives Considered
| Platform | Pros | Cons | Decision |
|----------|------|------|----------|
| **Supabase** | ✅ PostgreSQL, real-time features, auth ready, 500MB free | ⚠️ Newer platform | ✅ **Selected** |
| PlanetScale | MySQL, good developer experience | ❌ $39/month minimum after free trial | ❌ Rejected |
| Neon | PostgreSQL, good free tier | ⚠️ Smaller community, fewer features | 🟡 Alternative |
| Keep SQLite | Simple, no migration needed | ❌ No cloud persistence, no multi-user support | ❌ Rejected |
| Firebase Firestore | Google backing, real-time | ❌ NoSQL, different query patterns, vendor lock-in | ❌ Rejected |

### Rationale
- **PostgreSQL**: More advanced features than MySQL, better suited for future growth
- **Free Tier**: 500MB database and 2GB bandwidth monthly is sufficient for personal use
- **Future Features**: Built-in authentication, real-time subscriptions, row-level security
- **Tooling**: Excellent web-based admin interface and API
- **Migration**: Reasonable migration path from SQLite

### Consequences
- **Positive**: Cloud persistence, advanced PostgreSQL features, future-ready
- **Negative**: Migration complexity, learning curve for PostgreSQL-specific features
- **Mitigation**: Thorough testing, backup procedures, fallback to SQLite for development

---

## ADR-003: Frontend Hosting Platform Selection

**Status**: Accepted  
**Date**: 2024-12-09  
**Context**: Need to host the Vue.js frontend application with zero costs and global availability.

### Decision
Use **GitHub Pages** for frontend hosting.

### Alternatives Considered
| Platform | Pros | Cons | Decision |
|----------|------|------|----------|
| **GitHub Pages** | ✅ Free for public repos, GitHub integration, reliable CDN | ⚠️ Static hosting only, limited routing | ✅ **Selected** |
| Netlify | Great developer experience, advanced features | ⚠️ 100GB bandwidth limit, eventual paid features | 🟡 Alternative |
| Vercel | Excellent performance, Next.js optimization | ⚠️ 100GB bandwidth limit, eventual paid features | 🟡 Alternative |
| Cloudflare Pages | Unlimited bandwidth, global CDN | ⚠️ Complex configuration, newer platform | 🟡 Alternative |
| Firebase Hosting | Google backing, good integration | ⚠️ Vendor lock-in, complex pricing | ❌ Rejected |

### Rationale
- **Zero Cost**: Truly unlimited for public repositories
- **Reliability**: GitHub's infrastructure and global CDN
- **Integration**: Native GitHub Actions integration for CI/CD
- **Simplicity**: Straightforward setup and configuration
- **Routing**: Vue.js hash routing works well with GitHub Pages limitations

### Consequences
- **Positive**: Zero costs, reliable hosting, automated deployment
- **Negative**: Static hosting limitations, hash routing required
- **Mitigation**: Configure Vue.js for hash routing, implement client-side routing properly

---

## ADR-004: Mobile Strategy Selection

**Status**: Accepted  
**Date**: 2024-12-09  
**Context**: Need to provide mobile access to TaskMan without additional development costs or complexity.

### Decision
Implement **Progressive Web App (PWA)** instead of native mobile applications.

### Alternatives Considered
| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Progressive Web App** | ✅ One codebase, instant updates, no app store | ⚠️ Limited iOS features, no app store presence | ✅ **Selected** |
| React Native | Native performance, code sharing | ❌ Additional codebase, app store complexity, $99/year iOS | ❌ Rejected |
| Flutter | Good performance, single codebase for mobile | ❌ Learning curve, still requires app store process | ❌ Rejected |
| Native iOS/Android | Best performance, full platform features | ❌ Two separate codebases, high development cost | ❌ Rejected |
| Cordova/PhoneGap | Web technologies, app store presence | ❌ Performance issues, maintenance overhead | ❌ Rejected |

### Rationale
- **Cost Efficiency**: No additional development or maintenance costs
- **Single Codebase**: Vue.js application serves all platforms
- **Instant Updates**: No app store approval process for updates
- **User Experience**: Modern PWAs provide near-native experience
- **Installation**: "Add to Home Screen" provides app-like installation

### Consequences
- **Positive**: Zero additional development cost, instant updates, cross-platform
- **Negative**: Limited iOS PWA features, no app store presence
- **Mitigation**: Focus on excellent web experience, consider TWA for Android if needed

---

## ADR-005: Containerization Strategy

**Status**: Accepted  
**Date**: 2024-12-09  
**Context**: Need to package the Express backend for cloud deployment while maintaining platform independence.

### Decision
Use **Docker containerization** with single-stage builds for simplicity.

### Alternatives Considered
| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **Docker Single-stage** | ✅ Simple, works everywhere, platform independent | ⚠️ Larger image size | ✅ **Selected** |
| Docker Multi-stage | Smaller images, optimized builds | ⚠️ More complexity, not needed for small app | 🟡 Future optimization |
| Buildpacks | No Dockerfile needed, optimized builds | ⚠️ Less control, platform-specific | ❌ Rejected |
| Direct Deployment | Simple, no containerization overhead | ❌ Platform lock-in, inconsistent environments | ❌ Rejected |
| Serverless Functions | Auto-scaling, pay-per-use | ❌ Cold starts, vendor lock-in, complexity | ❌ Rejected |

### Rationale
- **Platform Independence**: Docker containers run consistently across platforms
- **Portability**: Easy to migrate between cloud providers
- **Development Parity**: Same environment for development and production
- **Simplicity**: Single-stage build is sufficient for the application size
- **Future-Proof**: Enables migration to Kubernetes or other orchestration platforms

### Consequences
- **Positive**: Platform independence, consistent environments, easy migration
- **Negative**: Slight complexity increase, image size considerations
- **Mitigation**: Optimize Dockerfile for size, use Alpine base images, implement health checks

---

## ADR-006: CI/CD Platform Selection

**Status**: Accepted  
**Date**: 2024-12-09  
**Context**: Need continuous integration and deployment pipeline for both frontend and backend components.

### Decision
Use **GitHub Actions** for CI/CD pipeline.

### Alternatives Considered
| Platform | Pros | Cons | Decision |
|----------|------|------|----------|
| **GitHub Actions** | ✅ Free for public repos, native GitHub integration | ⚠️ YAML configuration complexity | ✅ **Selected** |
| GitLab CI | Good features, integrated platform | ❌ Would require repository migration | ❌ Rejected |
| CircleCI | Fast builds, good caching | ❌ Limited free tier, external dependency | ❌ Rejected |
| Jenkins | Highly configurable, self-hosted | ❌ Maintenance overhead, hosting costs | ❌ Rejected |
| Manual Deployment | Simple, no additional complexity | ❌ Error-prone, no automation benefits | ❌ Rejected |

### Rationale
- **Zero Cost**: Unlimited minutes for public repositories
- **Native Integration**: Seamless integration with GitHub repository and issues
- **Deployment Targets**: Can deploy to both GitHub Pages and external services
- **Workflow Flexibility**: Supports complex workflows with multiple jobs and stages
- **Community**: Large ecosystem of actions and community support

### Consequences
- **Positive**: Zero costs, native integration, flexible workflows
- **Negative**: YAML learning curve, GitHub vendor dependency
- **Mitigation**: Start with simple workflows, use community actions, document procedures

---

## Decision Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Render.com for backend hosting | ✅ Accepted | Zero cost hosting |
| ADR-002 | Supabase PostgreSQL for database | ✅ Accepted | Cloud persistence |
| ADR-003 | GitHub Pages for frontend hosting | ✅ Accepted | Free global CDN |
| ADR-004 | PWA for mobile strategy | ✅ Accepted | Cross-platform app |
| ADR-005 | Docker containerization | ✅ Accepted | Platform independence |
| ADR-006 | GitHub Actions for CI/CD | ✅ Accepted | Automated deployment |

## Review and Updates

These ADRs should be reviewed and updated as:
- Technology landscapes change
- New requirements emerge
- Performance or cost issues arise
- Team expertise evolves

**Next Review Date**: 2025-03-09 (Quarterly)  
**Review Owner**: Technical Lead  
**Review Process**: Team discussion and consensus required for changes

---

**Document Version**: 1.0  
**Last Updated**: December 9, 2024  