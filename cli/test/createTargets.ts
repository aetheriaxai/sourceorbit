import { assert, expect, test } from 'vitest'
import { Targets } from '../src/targets'
import path from 'path';

export const cwd = path.join(`/`, `projects`);

export function createTargets(withDeps = false) {
  const targets = new Targets(cwd);

  const programACommand = targets.resolveObject(path.join(cwd, `qcmdsrc`, `programA.cmd`));
  expect(programACommand.name).toBe(`PROGRAMA`);
  expect(programACommand.type).toBe(`CMD`);
  expect(programACommand.extension).toBe(`cmd`);
  expect(programACommand.relativePath).toBe(path.join(`qcmdsrc`, `programA.cmd`));

  const unusedCmd = targets.resolveObject(path.join(cwd, `qcmdsrc`, `unused.cmd`));
  expect(unusedCmd.name).toBe(`UNUSED`);
  expect(unusedCmd.type).toBe(`CMD`);
  expect(unusedCmd.extension).toBe(`cmd`);
  expect(unusedCmd.relativePath).toBe(path.join(`qcmdsrc`, `unused.cmd`));

  const programA = targets.resolveObject(path.join(cwd, `qrpglesrc`, `programA.pgm.rpgle`));
  expect(programA.name).toBe(`PROGRAMA`);
  expect(programA.type).toBe(`PGM`);
  expect(programA.extension).toBe(`rpgle`);
  expect(programA.relativePath).toBe(path.join(`qrpglesrc`, `programA.pgm.rpgle`));

  const programB = targets.resolveObject(path.join(cwd, `qrpglesrc`, `programB.pgm.sqlrpgle`));
  expect(programB.name).toBe(`PROGRAMB`);
  expect(programB.type).toBe(`PGM`);
  expect(programB.extension).toBe(`sqlrpgle`);
  expect(programB.relativePath).toBe(path.join(`qrpglesrc`, `programB.pgm.sqlrpgle`));
  programB.imports = [`TOLOWER`];

  const programC = targets.resolveObject(path.join(cwd, `qrpglesrc`, `programC.pgm.sqlrpgle`));
  expect(programC.name).toBe(`PROGRAMC`);
  expect(programC.type).toBe(`PGM`);
  expect(programC.extension).toBe(`sqlrpgle`);
  expect(programC.relativePath).toBe(path.join(`qrpglesrc`, `programC.pgm.sqlrpgle`));
  programC.imports = [`TOUPPER`];

  // moduleA is not depended on
  const moduleA = targets.resolveObject(path.join(cwd, `qrpglesrc`, `moduleA.rpgle`));
  expect(moduleA.name).toBe(`MODULEA`);
  expect(moduleA.type).toBe(`MODULE`);
  expect(moduleA.extension).toBe(`rpgle`);
  expect(moduleA.relativePath).toBe(path.join(`qrpglesrc`, `moduleA.rpgle`));
  moduleA.exports = [`SUMNUMS`];
  
  const moduleB = targets.resolveObject(path.join(cwd, `qrpglesrc`, `moduleB.sqlrpgle`));
  expect(moduleB.name).toBe(`MODULEB`);
  expect(moduleB.type).toBe(`MODULE`);
  expect(moduleB.extension).toBe(`sqlrpgle`);
  expect(moduleB.relativePath).toBe(path.join(`qrpglesrc`, `moduleB.sqlrpgle`));
  moduleB.exports = [`TOLOWER`];

  const srvpgmAModule = targets.resolveObject(path.join(cwd, `qrpglesrc`, `srvpgmA.rpgle`));
  expect(srvpgmAModule.name).toBe(`SRVPGMA`);
  expect(srvpgmAModule.type).toBe(`MODULE`);
  expect(srvpgmAModule.extension).toBe(`rpgle`);
  expect(srvpgmAModule.relativePath).toBe(path.join(`qrpglesrc`, `srvpgmA.rpgle`));
  srvpgmAModule.imports = [`TOLOWER`];
  srvpgmAModule.exports = [`TOUPPER`];
  
  const fileA = targets.resolveObject(path.join(cwd, `qddssrc`, `fileA.sql`));
  expect(fileA.name).toBe(`FILEA`);
  expect(fileA.type).toBe(`FILE`);
  expect(fileA.extension).toBe(`sql`);
  expect(fileA.relativePath).toBe(path.join(`qddssrc`, `fileA.sql`));
  
  const fileB = targets.resolveObject(path.join(cwd, `qddssrc`, `fileB.pf`));
  expect(fileB.name).toBe(`FILEB`);
  expect(fileB.type).toBe(`FILE`);
  expect(fileB.extension).toBe(`pf`);
  expect(fileB.relativePath).toBe(path.join(`qddssrc`, `fileB.pf`));

  const ORDENTSRV = targets.resolveObject(path.join(cwd, `qbndsrc`, `ordentsrv.binder`));
  ORDENTSRV.exports = [`FIXTOTALS`];
  expect(ORDENTSRV.name).toBe(`ORDENTSRV`);
  expect(ORDENTSRV.type).toBe(`SRVPGM`);
  expect(ORDENTSRV.extension).toBe(`binder`);
  expect(ORDENTSRV.relativePath).toBe(path.join(`qbndsrc`, `ordentsrv.binder`));

  const ORDENTMOD = targets.resolveObject(path.join(cwd, `qrpglesrc`, `ordentmod.rpgle`));
  ORDENTMOD.exports = [`FIXTOTALS`];
  expect(ORDENTMOD.name).toBe(`ORDENTMOD`);
  expect(ORDENTMOD.type).toBe(`MODULE`);
  expect(ORDENTMOD.extension).toBe(`rpgle`);
  expect(ORDENTMOD.relativePath).toBe(path.join(`qrpglesrc`, `ordentmod.rpgle`));

  const UNUSEDSRV = targets.resolveObject(path.join(cwd, `qbndsrc`, `unusedsrv.binder`));
  UNUSEDSRV.exports = [`BIGNOPE`];
  expect(UNUSEDSRV.name).toBe(`UNUSEDSRV`);
  expect(UNUSEDSRV.type).toBe(`SRVPGM`);
  expect(UNUSEDSRV.extension).toBe(`binder`);
  expect(UNUSEDSRV.relativePath).toBe(path.join(`qbndsrc`, `unusedsrv.binder`));

  if (withDeps) {
    targets.createOrAppend(programA, fileA);
    targets.createOrAppend(programA, programB);
    targets.createOrAppend(programB);
    targets.createOrAppend(moduleA, fileA);
    targets.createOrAppend(moduleA, fileB);
    targets.createOrAppend(moduleB, fileB);
    targets.createOrAppend(srvpgmAModule);
    targets.createOrAppend(ORDENTSRV);
    targets.createOrAppend(ORDENTMOD);
    targets.createOrAppend(UNUSEDSRV);
    targets.createOrAppend(programACommand);
    targets.createOrAppend(unusedCmd);
  }

  return targets;
}