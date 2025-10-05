import type { DiffLine } from "@/lib/types";

export const diffFixture: DiffLine[] = [
  {
    leftNumber: 1,
    rightNumber: 1,
    left: "{",
    right: "{",
    status: "unchanged",
  },
  {
    leftNumber: 2,
    rightNumber: 2,
    left: '   "id": 432232523,',
    right: '  "id": 432232523,',
    status: "unchanged",
  },
  {
    leftNumber: 3,
    rightNumber: 3,
    left: '   "title": "Syncio T-Shirt",',
    right: '  "title": "Syncio T-Shirt",',
    status: "unchanged",
  },
  {
    leftNumber: 4,
    rightNumber: 4,
    left: '   "description": "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque. penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p><p>Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,</p>",',
    right:
      '  "description": "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p><p>Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,</p>",',
    status: "modified",
  },
  {
    leftNumber: 5,
    rightNumber: 5,
    left: '   "images": [',
    right: '  "images": [',
    status: "unchanged",
  },
  {
    leftNumber: 6,
    rightNumber: 6,
    left: '       { "id": 26372, "position": 1, "url": "...image_1.png" },',
    right: '      { "id": 26372, "position": 1, "url": "...image_1.png" },',
    status: "unchanged",
  },
  {
    leftNumber: 7,
    rightNumber: 7,
    left: '       { "id": 23445, "position": 2, "url": "...image_2.png" },',
    right: '      { "id": 33245, "position": 2, "url": "...image_2.png" },',
    status: "modified",
  },
  {
    leftNumber: 8,
    rightNumber: 8,
    left: '       { "id": 34566, "position": 3, "url": "...image_3.png" },',
    right: '      { "id": 56353, "position": 3, "url": "...image_5.png" },',
    status: "modified",
  },
  {
    leftNumber: 9,
    rightNumber: 9,
    left: '       { "id": 33253, "position": 4, "url": "...image_4.png" },',
    right: '      { "id": 33213, "position": 4, "url": "...image_4.png" },',
    status: "modified",
  },
  {
    leftNumber: 10,
    rightNumber: 10,
    left: '       { "id": 56353, "position": 5, "url": "...image_5.png" },',
    right: '      { "id": 34546, "position": 5, "url": "...image_16.png" },',
    status: "modified",
  },
  {
    leftNumber: null,
    rightNumber: 11,
    left: "",
    right: '      { "id": 34566, "position": 3, "url": "...image_7.png" },',
    status: "added",
  },
  {
    leftNumber: 11,
    rightNumber: 12,
    left: "   ],",
    right: "  ],",
    status: "unchanged",
  },
  {
    leftNumber: 12,
    rightNumber: 13,
    left: '   "variants": [',
    right: '  "variants": [',
    status: "unchanged",
  },
  {
    leftNumber: 13,
    rightNumber: 14,
    left: '       { "id": 433232, "sku": "SKU-II-10", "barcode": "BAR_CODE_230", "image_id": 26372, "inventory_quantity": 12 },',
    right:
      '       { "id": 433232, "sku": "SKU-II-10", "barcode": "BAR_CODE_230", "image_id": 34566, "inventory_quantity": 12 },',
    status: "modified",
  },
  {
    leftNumber: 14,
    rightNumber: 15,
    left: '       { "id": 231544, "sku": "SKU-II-20", "barcode": "B231342313", "image_id": 23445, "inventory_quantity": 2 },',
    right:
      '       { "id": 231544, "sku": "SKU-II-20", "barcode": "B231342313", "image_id": 56353, "inventory_quantity": 2 },',
    status: "modified",
  },
  {
    leftNumber: 15,
    rightNumber: 16,
    left: '       { "id": 323245, "sku": "SKU-II-1O", "barcode": "BACDSDE_0", "image_id": 34566, "inventory_quantity": 8 },',
    right:
      '       { "id": 323245, "sku": "SKU-II-10", "barcode": "BACDSDE_O", "image_id": 26372, "inventory_quantity": 8 },',
    status: "modified",
  },
  {
    leftNumber: 16,
    rightNumber: 17,
    left: '       { "id": 323445, "sku": "SKU-II-1o", "barcode": "AR_CO23DE_23", "image_id": 33253, "inventory_quantity": 0 },',
    right:
      '       { "id": 323445, "sku": "SKU-II-1о", "barcode": "AR_CO23DE_23", "image_id": 33213, "inventory_quantity": 0 },',
    status: "modified",
  },
  {
    leftNumber: 17,
    rightNumber: 18,
    left: "   ]",
    right: "  ]",
    status: "unchanged",
  },
  {
    leftNumber: 18,
    rightNumber: 19,
    left: "}",
    right: "}",
    status: "unchanged",
  },
  {
    leftNumber: 19,
    rightNumber: 20,
    left: '   "description": "<p>Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque. penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p><p>Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,</p>",',
    right:
      '  "description": "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p><p>Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus,</p>",',
    status: "modified",
  },
];
