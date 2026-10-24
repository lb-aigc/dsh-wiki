import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { WikiConfig } from './settings.ts';
export declare const name = "ldd-wiki";
export declare const inject: string[];
export interface Config extends WikiConfig {
}
export declare const Config: z<Config, Config>;
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map