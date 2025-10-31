export type Virtualia = {
  version: "0.1.0";
  name: "virtualia";
  instructions: [
    {
      name: "initializeUser";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "mintContent";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "profile";
          isMut: true;
          isSigner: false;
        },
        {
          name: "content";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "metadata";
          type: {
            defined: "ContentMetadata";
          };
        }
      ];
    },
    {
      name: "distributeReward";
      accounts: [
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "profile";
          isMut: false;
          isSigner: false;
        },
        {
          name: "treasury";
          isMut: true;
          isSigner: false;
        },
        {
          name: "recipient";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "Profile";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "totalMints";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "Content";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "contentType";
            type: "string";
          },
          {
            name: "rewardLamports";
            type: "u64";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "ContentMetadata";
      type: {
        kind: "struct";
        fields: [
          {
            name: "title";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "contentType";
            type: "string";
          },
          {
            name: "rewardLamports";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidMetadata";
      msg: "Metadados inválidos: verifique título e URI";
    },
    {
      code: 6001;
      name: "InvalidReward";
      msg: "Valor de recompensa inválido";
    },
    {
      code: 6002;
      name: "Overflow";
      msg: "Overflow detectado";
    }
  ];
  metadata: {
    address: "9tiQZMaqGUhPLH7y4oYo6CTAQmFK18G1WsCrDjkDPDak";
  };
};

export const IDL: Virtualia = {
  version: "0.1.0",
  name: "virtualia",
  instructions: [
    {
      name: "initializeUser",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        }
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        }
      ],
    },
    {
      name: "mintContent",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "profile",
          isMut: true,
          isSigner: false,
        },
        {
          name: "content",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        }
      ],
      args: [
        {
          name: "metadata",
          type: {
            defined: "ContentMetadata",
          },
        }
      ],
    },
    {
      name: "distributeReward",
      accounts: [
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "profile",
          isMut: false,
          isSigner: false,
        },
        {
          name: "treasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "recipient",
          isMut: true,
          isSigner: false,
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        }
      ],
    }
  ],
  accounts: [
    {
      name: "Profile",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "totalMints",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          }
        ],
      },
    },
    {
      name: "Content",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "title",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "contentType",
            type: "string",
          },
          {
            name: "rewardLamports",
            type: "u64",
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "bump",
            type: "u8",
          }
        ],
      },
    }
  ],
  types: [
    {
      name: "ContentMetadata",
      type: {
        kind: "struct",
        fields: [
          {
            name: "title",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "contentType",
            type: "string",
          },
          {
            name: "rewardLamports",
            type: "u64",
          }
        ],
      },
    }
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidMetadata",
      msg: "Metadados inválidos: verifique título e URI",
    },
    {
      code: 6001,
      name: "InvalidReward",
      msg: "Valor de recompensa inválido",
    },
    {
      code: 6002,
      name: "Overflow",
      msg: "Overflow detectado",
    }
  ],
  metadata: {
    address: "9tiQZMaqGUhPLH7y4oYo6CTAQmFK18G1WsCrDjkDPDak",
  },
};

