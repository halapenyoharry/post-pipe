# Are.na API Integration Research

Research and protocol documentation for integrating Are.na as a topological data source into post-pipe. This enables cross-posting articles to Are.na channels and potentially building Are.na channel extraction tools.

## Section 1: Are.na API Integration Protocol for Topological Data Extraction

### 1. System Requirements

* **Are.na API Credentials:** A Personal Access Token (PAT) is required to authenticate requests, access private channels, and increase rate limits.
    * **Acquisition:** Generate a token in your account at [Are.na Applications Settings](https://www.are.na/settings/apps).
* **Data Processing Environment:** Python (utilizing the standard `requests` and `json` libraries) or a JavaScript runtime (Node.js) to execute HTTP requests and parse the resulting JSON structures.
* **Topological Rendering Tools:** Your existing local implementations of D3.js (for 2D force-directed graphs) or Three.js (for 3D spatial coordinate mapping) to visualize the data.

### 2. API Documentation and Support Materials

* **Interactive API Explorer (Current Context):** [Are.na v3 API Explorer - Deep Ecology Channel Example](https://www.are.na/developers/explore/channel/deep-ecology-htb7a3pw1va). This interface provides the exact JSON response schema, including channel attributes, visibility states, and item counts.
* **Base API Documentation:** [Are.na Developer Portal](https://dev.are.na/). Refer to this for complete endpoint specifications.

### 3. Execution Sequence 

#### Phase A: Data Extraction

Execute GET requests to the Are.na API endpoints to pull the raw relational data. 

1.  **Target Channel Contents (`GET /v3/channels/{slug}/contents`):** Retrieves the array of objects (blocks) contained within a specified channel. These represent the primary nodes in your topology.
2.  **Target Block Connections (`GET /v3/blocks/{id}/channels`):** Retrieves the array of all channels that contain a specific block ID. This data defines the structural links (edges) between discrete contextual categories.

*Required HTTP Header for Authentication:*
```
Authorization: Bearer YOUR_PERSONAL_ACCESS_TOKEN
```

#### Phase B: Structural Mapping for TopoThink

The raw JSON payload must be parsed and restructured into an explicit node-link format for your visualization scripts or local LLM ingestion.

1.  **Node Definition:** Iterate through the Are.na response array. Extract the integer `id`, string `class` (e.g., "Image", "Text"), and string `content` or `description` for each block.
2.  **Edge Definition:** Map the cross-channel relationships. If Block ID [X] is located in both Channel Slug [A] and Channel Slug [B], record a bidirectional link between A and B via X.
3.  **Density Calculation:** Tally the total number of channel connections per block. Blocks with high connection integers represent points of high structural density within your dataset.

#### Phase C: Output and Integration

Write the parsed node-link arrays to a local `.json` file. This static file acts as the explicit data source for your D3.js/Three.js visualizations or as structured context for your local Ollama/Exo cluster, removing reliance on live API calls during the rendering or processing phases.

---

## Section 2: Channel API Reference

**OpenAPI source:** https://api.are.na/v3/openapi.json

### GET /v3/channels/{id}

- **Label:** Get a channel
- **Docs:** https://www.are.na/developers/explore/channel
- **Requires resource id:** yes
- **Response content type:** application/json

Returns detailed information about a specific channel by its ID or slug. Respects visibility rules and user permissions.

#### Response Schema

```json
{
  "type": "object",
  "required": [
    "id",
    "type",
    "slug",
    "title",
    "state",
    "visibility",
    "created_at",
    "updated_at",
    "owner",
    "counts",
    "_links"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique identifier for the channel",
      "example": 12345
    },
    "type": {
      "type": "string",
      "enum": ["Channel"],
      "example": "Channel"
    },
    "slug": {
      "type": "string",
      "description": "Channel URL slug",
      "example": "my-collection-abc123"
    },
    "title": {
      "type": "string",
      "description": "Channel title",
      "example": "My Collection"
    },
    "description": {
      "type": "object",
      "description": "Channel description with multiple renderings",
      "properties": {
        "markdown": {
          "type": "string",
          "description": "Original markdown value",
          "example": "This is **only** a [test](https://example.com)."
        },
        "html": {
          "type": "string",
          "description": "HTML rendering of the markdown",
          "example": "<p>This is <strong>only</strong> a <a href=\"https://example.com\">test</a>.</p>"
        },
        "plain": {
          "type": "string",
          "description": "Plain text rendering",
          "example": "This is only a test (https://example.com)."
        }
      }
    },
    "state": {
      "type": "string",
      "enum": ["available", "deleted"],
      "description": "Lifecycle state. `available`: Active and accessible. `deleted`: Soft deleted."
    },
    "visibility": {
      "type": "string",
      "enum": ["public", "private", "closed"],
      "description": "`public`: Anyone can view. `private`: Only owner and collaborators. `closed`: Anyone can view, only collaborators can add."
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "When the channel was created",
      "example": "2023-01-15T10:30:00Z"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "When the channel was last updated",
      "example": "2023-01-15T14:45:00Z"
    },
    "owner": {
      "type": "object",
      "description": "Channel owner (User or Group)",
      "properties": {
        "id": {
          "type": "integer",
          "example": 12345
        },
        "type": {
          "type": "string",
          "enum": ["User", "Group"]
        },
        "name": {
          "type": "string",
          "example": "John Doe"
        },
        "slug": {
          "type": "string",
          "description": "URL-safe identifier (use this in API paths)",
          "example": "john-doe"
        },
        "avatar": {
          "type": "string",
          "format": "uri",
          "nullable": true,
          "example": "https://d2w9rnfcy7mm78.cloudfront.net/12345/avatar.jpg"
        },
        "initials": {
          "type": "string",
          "example": "JD"
        }
      }
    },
    "counts": {
      "type": "object",
      "description": "Counts of various items in the channel",
      "properties": {
        "blocks": {
          "type": "integer",
          "description": "Number of blocks in the channel",
          "example": 42
        },
        "channels": {
          "type": "integer",
          "description": "Number of channels connected to this channel",
          "example": 8
        },
        "contents": {
          "type": "integer",
          "description": "Total number of contents (blocks + channels)",
          "example": 50
        },
        "collaborators": {
          "type": "integer",
          "description": "Number of collaborators on the channel",
          "example": 3
        }
      }
    },
    "collaborators": {
      "type": "array",
      "description": "Collaborators on this channel (users and groups). Only present when channel is returned as a full resource.",
      "items": {
        "type": "object"
      }
    },
    "_links": {
      "type": "object",
      "description": "HATEOAS links for navigation (HAL format)",
      "properties": {
        "self": {
          "type": "object",
          "properties": {
            "href": {
              "type": "string",
              "format": "uri",
              "description": "The URL of the linked resource",
              "example": "https://api.are.na/v3/channels/12345"
            }
          }
        }
      }
    },
    "can": {
      "type": "object",
      "description": "Actions the current user can perform on this channel",
      "properties": {
        "add_to": {
          "type": "boolean",
          "description": "Whether the user can add blocks to this channel"
        },
        "update": {
          "type": "boolean",
          "description": "Whether the user can update this channel"
        },
        "destroy": {
          "type": "boolean",
          "description": "Whether the user can delete this channel"
        },
        "manage_collaborators": {
          "type": "boolean",
          "description": "Whether the user can add/remove collaborators"
        }
      }
    }
  }
}
```

#### Key Endpoints for Implementation

- `GET /v3/channels/{slug}/contents` — Get all blocks in a channel
- `GET /v3/blocks/{id}/channels` — Get all channels containing a specific block
- `POST /v3/channels/{slug}/blocks` — Add a block to a channel (requires auth)
- `GET /v3/channels/{slug}` — Get channel metadata

---

## Integration Strategy Notes

1. **Topological Mapping:** Are.na's block-channel relationships create natural graph structures suitable for D3.js visualization or local LLM context windows.
2. **Authentication:** Store the PAT in `auth/.env` as `ARENA_TOKEN` (follow existing pattern with `GITHUB_TOKEN`).
3. **Schema Alignment:** Are.na channels could complement post-pipe's syndication model — track which articles have been saved to which Are.na channels in the article frontmatter.
4. **Caching Strategy:** Use Phase C output (static JSON files) to avoid rate-limiting during development and visualization.
