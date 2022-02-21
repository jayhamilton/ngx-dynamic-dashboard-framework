export const rbac_model = {
  access_controls: [
    {
      name: 'admin',
      permissions: [
        {
          module_name: 'configuration',
          create_action: true,
          read_action: true,
          update_action: true,
          delete_action: true,
          instances: [
            {
              instance_name: '',
              create_action: true,
              read_action: true,
              update_action: true,
              delete_action: true,
            },
          ],
        },
        {
          module_name: 'library',
          create_action: true,
          read_action: true,
          update_action: true,
          delete_action: true,
          instances: [
            {
              instance_name: '',
              create_action: true,
              read_action: true,
              update_action: true,
              delete_action: true,
            },
          ],
        },
        {
          module_name: 'navigation',
          create_action: true,
          read_action: true,
          update_action: true,
          delete_action: true,
          instances: [
            {
              instance_name: '',
              create_action: true,
              read_action: true,
              update_action: true,
              delete_action: true,
            },
          ],
        },
        {
          module_name: 'layout',
          create_action: true,
          read_action: true,
          update_action: true,
          delete_action: true,
          instances: [
            {
              instance_name: '',
              create_action: true,
              read_action: true,
              update_action: true,
              delete_action: true,
            },
          ],
        },
        {
          module_name: 'gadget-menu',
          create_action: true,
          read_action: true,
          update_action: true,
          delete_action: true,
          instances: [
            {
              instance_name: '',
              create_action: true,
              read_action: true,
              update_action: true,
              delete_action: true,
            },
          ],
        },
      ],
    },
    {
      name: 'user',
      permissions: [
        {
          module_name: 'configuration',
          create_action: false,
          read_action: false,
          update_action: false,
          delete_action: false,
          instances: [],
        },
        {
          module_name: 'library',
          create_action: false,
          read_action: false,
          update_action: false,
          delete_action: false,
          instances: [],
        },
        {
          module_name: 'navigation',
          create_action: false,
          read_action: false,
          update_action: false,
          delete_action: false,
          instances: [],
        },
        {
          module_name: 'layout',
          create_action: false,
          read_action: false,
          update_action: false,
          'delete_act,ion': false,
          instances: [],
        },
        {
          module_name: 'gadget-menu',
          create_action: false,
          read_action: false,
          update_action: false,
          delete_action: false,
          instances: [],
        },
      ],
    },
  ],
};
