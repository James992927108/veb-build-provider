# Syntax Scope Naming — 統一命名對照表

## 目標與準則

所有語法高亮的自訂 scope 統一為：

```
<通用scope>.<細分>.<language-suffix>
```

其中 `<language-suffix>` 對應該 grammar 的 `scopeName` 短名，且語言 `id` 一律使用 `ami_` 前綴：

| 檔案 (grammar) | scopeName | 語言 id | 統一後 suffix |
|---|---|---|---|
| `BiosLanguage.tmLanguage_veb.json` | `source.veb` | `ami_veb` | `veb` |
| `BiosLanguage.tmLanguage_sdl.json` | `source.sdl` | `ami_sdl` | `sdl` |
| `edk2_dec` | `source.edk2_dec` | `edk2_dec` | `edk2_dec` |
| `edk2_dsc` | `source.edk2_dsc` | `edk2_dsc` | `edk2_dsc` |
| `edk2_inf` | `source.edk2_inf` | `edk2_inf` | `edk2_inf` |
| `edk2_fdf` | `source.edk2_fdf` | `edk2_fdf` | `edk2_fdf` |
| `edk2_vfr` | `source.edk2_vfr` | `edk2_vfr` | `edk2_vfr` |
| `edk2_uni` | `source.edk2_uni` | `edk2_uni` | `edk2_uni` |
| `edk2_cif` | `source.cif` | `edk2_cif` | `edk2_cif` |
| `ami_build.tmLanguage.json` | `source.ami_build` | `ami_build` | `ami_build` |
| `language-x86_64-assembly` | (第三方，不動) | `asm` | — |

**規則**
1. 語言 `id` 用 `ami_` 前綴統一（`ami_veb` / `ami_sdl` / `ami_build`）。
2. 移除所有 `BiosLanguage` / `BiosLanguage_*` scope（含糊、無主題對應）。
3. 禁止跨檔借用他檔 scope（`.dsc/.dec/.fdf/.cif` 不再使用 `edk2_inf` 後綴）。
4. 每檔所有自訂 scope 的末段 suffix 必須 == 該檔 suffix。

> 註：`ami_veb`、`ami_sdl` 的 scope 後綴維持短名 `veb` / `sdl`（scopeName 為 `source.veb` / `source.sdl`）；`ami_build` 的 suffix 則直接用 `ami_build`。

---

## 逐檔對照（現在 → 統一後）

### edk2_dec / edk2_dsc / edk2_inf / edk2_cif
| 檔案 | 舊（誤）scope | 統一後 |
|---|---|---|
| dec | `variable.function.constructor.BiosLanguage` | `…edk2_dec` |
| dec | `entity.name.function.BiosLanguage` | `entity.name.function.edk2_dec` |
| dec | `entity.name.type.BiosLanguage` | `entity.name.type.edk2_dec` |
| dec | `invalid.illegal.BiosLanguage` | `invalid.illegal.edk2_dec` |
| dec | `string.quoted.double.edk2_inf` (錯標) | `string.quoted.double.edk2_dec` |
| dsc | 同 dec 結構 | `…edk2_dsc` |
| inf | `…BiosLanguage` | `…edk2_inf` |
| cif | `…BiosLanguage` + `…edk2_inf` | `…edk2_cif` |

### BiosLanguage.tmLanguage_veb.json  (語言 id `ami_veb`，suffix `veb`)
| 現在 | 統一後 |
|---|---|
| `variable.language.BiosLanguage_veb` | `variable.language.veb` |
| `invalid.illegal.BiosLanguage_veb` | `invalid.illegal.veb` |
| `variable.function.constructor.BiosLanguage_veb` | `variable.function.constructor.veb` |
| `entity.name.type.BiosLanguage_veb` | `entity.name.type.veb` |
| `entity.name.function.BiosLanguage_veb` | `entity.name.function.veb` |

### BiosLanguage.tmLanguage_sdl.json  (語言 id `ami_sdl`，suffix `sdl`)
| 現在 | 統一後 |
|---|---|
| `…BiosLanguage` | `….sdl`（分級配色：TOKEN/End→`keyword.control.sdl`、key→`variable.language.sdl`、值依型別→`string.quoted`/`constant.numeric`/`constant.language`/`entity.name.type`） |

### ami_build.tmLanguage.json  (語言 id `ami_build`，suffix `ami_build`)
SDLI 產生之 build token 檔（`.mak` / `.txt`，與 `Token.h` 同源）上色：
| Scope | 用途 |
|---|---|
| `keyword.control.ami_build` | `#define` / `#if` / `#endif` / `defined` |
| `entity.name.function.ami_build` | `#define` 後的 macro 名 |
| `variable.language.ami_build` | `NAME =` 左邊 key |
| `constant.numeric.ami_build` | 值 `0xffc00000` / `41` |
| `string.quoted.double.ami_build` | 值 `"..."` |
| `variable.parameter.ami_build` | 非字串值（如路徑/文字） |

---

## 驗證方式
見 `tools/scripts/validate_syntax_scopes.js`（獨立 Node 腳本）：
- 不得含 `BiosLanguage`
- 末段 suffix 必須 == 該檔 suffix（擋跨檔借用）
