# PAtris - Claude Code プロジェクトガイド

## プロジェクト概要

**PAtris** (旧称: four-tris) は、AutoIt3で構築されたオープンソースのテトリス系ブロックゲームトレーニングツールです。プレイヤーが様々なゲーム状況を素早く探索し、戦略をテストし、完全にカスタマイズ可能な環境で自由にトレーニングできます。

- **リポジトリ:** https://github.com/Felinicity/PAtris.git
- **ライセンス:** GNU General Public License v3.0
- **バージョン:** 1.5.2.0
- **プラットフォーム:** Windows (32-bit / 64-bit)

## 技術スタック

- **言語:** AutoIt3 (Windows自動化スクリプト言語)
- **グラフィックス:** WinAPI GDI+ (ビットマップ操作、ウィンドウ管理)
- **オーディオ:** BASS Audio Library
- **圧縮:** LZNT圧縮 (状態のシリアライズ用)
- **エンコード:** Base64 (データ共有用)

## ディレクトリ構造

```
PAtris/
├── Tetris.au3              # メインゲームエンジン (約4,000行)
├── ai/
│   ├── TetrisAI.au3        # AIモジュール (開発中)
│   └── misamino.dll        # AIライブラリ
├── lib/                    # ユーティリティライブラリ
│   ├── Base64.au3          # Base64エンコード/デコード
│   ├── Bass.au3            # オーディオエンジンラッパー
│   ├── BassConstants.au3   # オーディオ定数
│   ├── Keyboard.au3        # キーボードユーティリティ
│   └── LZNT.au3            # 圧縮ライブラリ
├── textures/               # カスタムスキン/テーマ
├── se/                     # 効果音ディレクトリ
├── settings.ini            # ユーザー設定 (キーバインド等)
├── colors.ini              # カラーテーマ/スキン
└── piece_list.txt          # テスト用ピース順序
```

## 主要ファイル

| ファイル | 行数 | 役割 |
|---------|------|------|
| `Tetris.au3` | ~3,955 | メインゲームエンジン |
| `lib/Bass.au3` | ~4,251 | オーディオライブラリ |
| `lib/BassConstants.au3` | ~564 | オーディオ定数 |
| `lib/Keyboard.au3` | ~221 | 入力ユーティリティ |
| `lib/Base64.au3` | ~124 | データエンコード |
| `lib/LZNT.au3` | ~107 | 圧縮処理 |

## ゲームモード

- **Training Mode** - 重力なし、自由配置で研究用
- **Cheese Race** - 指定高さまでガーベージラインを積む
- **Four Mode** - 4幅の開口部を配置するチャレンジ
- **PC Mode** - パーフェクトクリア練習
- **Master Mode** - フル重力シミュレーション

## コア機能

### ピースシステム
- 7種のテトリミノ (I, J, S, O, Z, L, T)
- 各4回転状態、SRS (Standard Rotation System) キックテーブル

### グリッドシステム
- 2D配列によるプレイフィールド表現
- 可視領域の上に4行の隠し領域
- デフォルト: 10x20 (設定変更可能)

### 高度な機能
- **Undo/Redo** - 状態管理による履歴操作
- **ボード編集** - クリックでピースを配置 (8色パレット)
- **Fumen連携** - オンラインエディタへのエクスポート
- **スクリーンショット取り込み** - 他ソースからボードをスナップして自動検出
- **状態シリアライズ** - Base64 + LZNT圧縮で共有可能な文字列に変換

## コーディング規約

### 関数命名
- 説明的なcamelCase
- 動詞から始める: `Move`, `Draw`, `Check`
- ドメインプレフィックス: `Piece`, `Grid`, `Draw`, `Bag`

### コード構成
- `#Region / #EndRegion` マーカーで論理的にグループ化
- ゲーム状態にグローバル変数を使用
- 複雑なデータには構造体的配列を使用

### 描画パイプライン
- WinAPI GDIによるレンダリング
- 互換DC (デバイスコンテキスト) によるオフスクリーンバッファリング
- スケーリング用のグラフィックス変換

## ビルド方法

### コンパイル設定 (Tetris.au3内)
```autoit
#AutoIt3Wrapper_Icon=icon.ico
#AutoIt3Wrapper_Outfile=build\current\four-tris-x86.exe
#AutoIt3Wrapper_Outfile_x64=build\current\four-tris-x64.exe
#AutoIt3Wrapper_Compile_Both=y
```

### ビルド手順
1. AutoIt3 Wrapper GUIまたはコマンドラインコンパイラを実行
2. x86とx64の両方の実行ファイルを生成
3. 出力先: `build/current/`

### 依存関係
- AutoIt3 v3.3.14+ (スクリプトインタープリタ)
- BASS audio library DLLs (`se/`に同梱)
- Misamino DLL (`ai/`、現在未実装)

## 設定ファイル

### settings.ini
```ini
[SETTINGS]
SKIN=DEFAULT
TEXTURE=rounded-square.png
DAS=133          # Delayed Auto Shift (ms)
ARR=16           # Auto Repeat Rate (ms)
GHOST_PIECE=True
BAG_TYPE=0       # 0=7-Bag, 1=14-Bag, 2=Random
```

### colors.ini
複数のカラーテーマを定義:
- DEFAULT, CHROMA, BRIGHT, JSTRIS, KOS, FUMEN

## 開発ロードマップ (ToDo.md より)

- 回転システムの修正 (SRS/SRS+切り替え)
- ガーベージ注入システム
- より強力なハイライトシステム
- Puyoサポート
- B-type Cheeseモード
- Zoneモード
- Bag RNG改善

## 注意事項

- コードは「messy and hacky」と自己評価されているが、実際には明確な関心の分離と良好なモジュール性を持つ
- AIモジュール (`ai/TetrisAI.au3`) は現在開発中で機能しない
- Windows専用のスクリプト言語のため、他OSでの実行は不可
