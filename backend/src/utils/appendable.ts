
type AppendableT = {
  id: idT
  parent_id?: idT|null
  children?: AppendableT[]
}

export function appendChildren<ObjT extends AppendableT>(rootIds: idT[], objs: ObjT[]): ObjT[] {
  // const idCnt: {[k: idT]: number} = {};

  // // count duplicated
  // for (const obj of objs) {
  //   if (idCnt[obj.id] !== undefined) {
  //     idCnt[obj.id] = idCnt[obj.id] + 1;
  //     console.log('obj id ' + obj.id + ' duplicated');

  //   } else {
  //     idCnt[obj.id] = 1;
  //   }
  // }
  // // remove duplicated if exists
  // for (const [id, cnt] of Object.entries(idCnt)) {
  //   if (cnt > 1) {
  //     const idx = objs.findIndex((item) => item.id === id);
  //     if (idx > -1) {
  //       objs.splice(idx, 1);
  //     }
  //   }
  // }


  const idMap: {[k: idT]: ObjT} = {};
  // construct id-map
  for (const obj of objs) {
    idMap[obj.id] = obj;
  }
  // loop for push children
  for (const obj of objs) {
    if (!obj.parent_id || !(obj.parent_id in idMap) ) {
      continue;
    }
    const parent = idMap[obj.parent_id];
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(obj);
  }
  // loop for selecting root
  const rootHolder: ObjT[] = [];
  for (const id of rootIds) {
    if (!(id in idMap)) {
      continue;
    }
    const root = idMap[id];
    rootHolder.push(root);
  }
  return rootHolder;
}