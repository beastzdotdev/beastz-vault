export function fields<T>(): { [P in keyof T]: P } {
  return new Proxy(
    {},
    {
      get: function (_: object, prop: string | symbol): string | symbol {
        return prop;
      },
    }
  ) as {
    [P in keyof T]: P;
  };
}

export function redirect(url: string) {
  window.location.href = url;
}

//! for dicebear
// diceBear: {
//   async genderAccurateAvatar(params: { gender: Gender; firstName: string; lastName: string }) {
//     return promisify(() => {
//       const { firstName, gender, lastName } = params;

//       const collorPallete = {
//         [Gender.MALE]: [
//           '32cbff',
//           '331832',
//           'db5461',
//           'ffc759',
//           'd3efbd',
//           '6d3b47',
//           '2a628f',
//           'dccca3',
//           '386641',
//           '1b3022',
//         ],
//         [Gender.FEMALE]: [
//           'ffe0b5',
//           'dec0f1',
//           '5dfdcb',
//           'af42ae',
//           '7161ef',
//           'a4036f',
//           'dec0f1',
//           'ead94c',
//           '21d19f',
//           '7fdeff',
//         ],
//         [Gender.OTHER]: [
//           'fe4a49',
//           '3a7d44',
//           'e6fdff',
//           '470063',
//           'd7af70',
//           '361134',
//           '63a375',
//           'd81e5b',
//           'ffe2d1',
//           '1d84b5',
//         ],
//       };

//       return createAvatar(initials, {
//         seed: firstName[0] + lastName[0],
//         radius: 0,
//         backgroundColor: collorPallete[gender],
//       });
//     });
//   },
// },
