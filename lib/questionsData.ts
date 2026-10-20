import { Question, Scenario } from './types';

export const initialQuickQuestions: Question[] = [
  {
    id: "qq-001",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "2.2.1",
    chapter_title: "リスクベースドテストの活動",
    k_level: "K2",
    question_text: "リスクベースドテスト（RBT）における「残存リスク」の説明として、最も適切なものはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "リスク軽減活動（テスト実施や修正など）を実施した後に依然として残るリスクのこと。",
        is_correct: true,
        explanation: "正解。残存リスク（Residual Risk）は、リスク対策・テスト実施後にプロジェクトや製品に残るリスクを指します。"
      },
      {
        choice_number: 2,
        choice_text: "プロジェクト初期のリスク識別ワークショップで洗い出されなかった未知のリスクのこと。",
        is_correct: false,
        explanation: "初期に特定されなかったリスクは未識別リスクであり、残存リスクの定義とは異なります。"
      },
      {
        choice_number: 3,
        choice_text: "テスト実行中に発生したブロッキングバグによって、テストが中断された領域のリスクのこと。",
        is_correct: false,
        explanation: "テスト阻害による未テスト領域は一時的なリスク状況であり、残存リスク全体の定義ではありません。"
      },
      {
        choice_number: 4,
        choice_text: "ステークホルダー間で合意された許容可能な最大リスクレベルのこと。",
        is_correct: false,
        explanation: "これは「リスク許容度（Risk Tolerance）」または「リスク受け入れ基準」の説明です。"
      }
    ],
    overall_explanation: "JSTQB AL TMおよびFLにおいて、残存リスクは対策実施後に残るリスクを指し、テストマネージャは残存リスクを評価してリリース可否の判断材料としてステークホルダーに提示します。",
    syllabus_reference: "AL TM シラバス 2.2 リスクベースドテスト / FL シラバス 1.3 テストの7原則",
    syllabus_section_id: "sec-tm-2-2-1"
  },
  {
    id: "qq-002",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "3.2.2",
    chapter_title: "レビューのマネジメント",
    k_level: "K2",
    question_text: "公式レビュー（インスペクションなど）において、メトリクス収集とプロセスの改善提案を主な責務とする役割はどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "作成者（Author）",
        is_correct: false,
        explanation: "作成者はレビュー対象成果物の修正と欠陥対応に責任を持ちます。"
      },
      {
        choice_number: 2,
        choice_text: "モデレータ / レビューリーダー（Moderator / Review Leader）",
        is_correct: true,
        explanation: "正解。モデレータはレビュー会議の進行役を務め、ミーティングの有効性評価やメトリクス収集、プロセス改善の主導を担当します。"
      },
      {
        choice_number: 3,
        choice_text: "書記（Scribe / Recorder）",
        is_correct: false,
        explanation: "書記は指摘事項の記録を行いますが、メトリクス収集やプロセス改善自体のリード責務はモデレータ/リーダーが担います。"
      },
      {
        choice_number: 4,
        choice_text: "マネージャ（Manager）",
        is_correct: false,
        explanation: "マネージャはレビューの実施決定やリソース割り当てを行いますが、特定レビュー内のメトリクス収集や直接の改善提案役ではありません。"
      }
    ],
    overall_explanation: "レビューリーダーやモデレータは会議の円滑な進行だけでなく、レビュー結果のメトリクス（欠陥密度、発見工数など）を収集し、後続プロセスの改善に繋げる役割を担います。",
    syllabus_reference: "AL TM シラバス 3.2 レビュープロセス / FL シラバス 3.2 レビュープロセス",
    syllabus_section_id: "sec-tm-3-2-2"
  },
  {
    id: "qq-003",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "2.1",
    chapter_title: "リスクの概念と分類",
    k_level: "K2",
    question_text: "プロジェクトリスクと製品リスクの区別に関する記述として、最も適切なものはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "決済処理での二重課金の発生はプロジェクトリスクであり、開発者の離職は製品リスクである。",
        is_correct: false,
        explanation: "二重課金はソフトウェア成果物の品質不良であるため「製品リスク」、開発者の離職はプロジェクト運営上の脅威であるため「プロジェクトリスク」です。"
      },
      {
        choice_number: 2,
        choice_text: "テスト環境の提供遅延はプロジェクトリスクであり、アクセス集中時のレスポンス劣化は製品リスクである。",
        is_correct: true,
        explanation: "正解。環境構築遅延は進行・スケジュール上のリスク（プロジェクトリスク）であり、性能問題は成果物の品質特性上のリスク（製品リスク）です。"
      },
      {
        choice_number: 3,
        choice_text: "テストマネージャは製品リスクのみを管理し、プロジェクトリスクはプロジェクトマネージャ（PM）に一任すべきである。",
        is_correct: false,
        explanation: "テストマネージャはテスト活動に影響を与えるプロジェクトリスク（テスト環境、ツール、人員等）も監視・コントロールする必要があります。"
      },
      {
        choice_number: 4,
        choice_text: "製品リスクは事前に予測・スコアリング可能であるが、プロジェクトリスクは事後対応しかできない。",
        is_correct: false,
        explanation: "プロジェクトリスクもリスク計画段階で洗い出し、予防策・コンティンジェンシープランを策定できます。"
      }
    ],
    overall_explanation: "製品リスクは成果物の品質特性（機能性、信頼性、効率性など）に関連し、プロジェクトリスクは予算・スケジュール・体制などプロジェクト目標の達成に関連します。",
    syllabus_reference: "AL TM シラバス 2.1 リスクの概念",
    syllabus_section_id: "sec-tm-2-1"
  },
  {
    id: "qq-004",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "5.1",
    chapter_title: "テストプロセス改善モデル",
    k_level: "K2",
    question_text: "TMMi（Test Maturity Model integration）のレベル2（管理された）からレベル3（定義された）へのステップアップを最もよく表しているものはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "各プロジェクトで個別に運用されていたテスト計画やモニタリング手法を、組織標準プロセスとして体系化し共通適用すること。",
        is_correct: true,
        explanation: "正解。TMMi レベル2は「プロジェクト単位での管理」ですが、レベル3は「組織全体でのプロセスの標準化・定義・統合」が中核となります。"
      },
      {
        choice_number: 2,
        choice_text: "統計的プロセス制御を導入し、テスト自動化率を100%に引き上げること。",
        is_correct: false,
        explanation: "統計的測定や定量管理はレベル4（測定された）の領域です。"
      },
      {
        choice_number: 3,
        choice_text: "単体テストフェーズを廃止し、すべてシステムテストフェーズで欠陥を検出すること。",
        is_correct: false,
        explanation: "シフトレフトやテストレベルの統合に反するアンチパターンです。"
      },
      {
        choice_number: 4,
        choice_text: "テストマネージャの役割を排除し、完全な自己組織化アジャイルチームへ移行すること。",
        is_correct: false,
        explanation: "TMMiモデルの成熟度ステップとは無関係です。"
      }
    ],
    overall_explanation: "TMMi レベル2（Managed）はプロジェクト単位での方針・計画・監視・設計を重視し、レベル3（Defined）では組織横断的なテスト標準化、テスト組織の確立、静的テスト（レビュー）の全社統合などが求められます。",
    syllabus_reference: "AL TM シラバス 5.1 テストプロセス改善",
    syllabus_section_id: "sec-tm-5-1"
  },
  {
    id: "qq-005",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "1.1",
    chapter_number: 1,
    chapter_title: "テスト計画とコントロール",
    k_level: "K2",
    question_text: "テストの「終了基準（Exit Criteria）」を策定する際、最も客観的かつ効果的なアプローチはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "リリース予定日を迎えるか、あるいはテスト予算が枯渇した時点でテスト終了とする。",
        is_correct: false,
        explanation: "期日や予算の枯渇は制約事項に過ぎず、品質水準を担保する客観的な終了基準ではありません。"
      },
      {
        choice_number: 2,
        choice_text: "高リスク要件のカバレッジ100%、未解決の重要度高（Critical）欠陥0件、既知の残存リスクの受入合意を基準とする。",
        is_correct: true,
        explanation: "正解。カバレッジ、欠陥深刻度別残存数、残存リスク合意といった定量的・定性的な複合指標が最も適切です。"
      },
      {
        choice_number: 3,
        choice_text: "開発リーダーが「これ以上の重大な欠陥はない」と口頭で宣言することを基準とする。",
        is_correct: false,
        explanation: "主観的で検証可能性がないため終了基準として不適格です。"
      },
      {
        choice_number: 4,
        choice_text: "発見された総欠陥数が、過去プロジェクトの平均欠陥数を上回った時点で終了とする。",
        is_correct: false,
        explanation: "欠陥発見数はプロダクト規模や品質により変動するため、それ単体で完了判断はできません。"
      }
    ],
    overall_explanation: "終了基準（Exit Criteria）は、ステークホルダーと事前に合意された定量的・定性的基準（リスクカバレッジ、残存欠陥数、残存リスク評価）によって構成されるべきです。",
    syllabus_reference: "AL TM シラバス 1.1 テスト計画 / FL シラバス 1.4 テストプロセス",
    syllabus_section_id: "sec-tm-1-1"
  },
  {
    id: "qq-006",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "6.1",
    chapter_title: "テストツール選定とROI",
    k_level: "K2",
    question_text: "テスト自動化ツールの導入を検討する際、テストマネージャがROI（費用対効果）計算で見落としがちな最大の運用コストはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "ツールの初期ライセンス購入費用",
        is_correct: false,
        explanation: "初期ライセンス費用は初期見積もりで最も認識されやすいコストです。"
      },
      {
        choice_number: 2,
        choice_text: "仕様変更やUI変更に伴うテストスクリプトの継続的な保守・修正工数",
        is_correct: true,
        explanation: "正解。自動化の最大コストは作成後の継続的な保守工数（メンテナンスコスト）であり、過小評価されがちです。"
      },
      {
        choice_number: 3,
        choice_text: "テスト実行用のPC端末の電気代",
        is_correct: false,
        explanation: "電気代は微小な経費であり、ROIを左右する主要因ではありません。"
      },
      {
        choice_number: 4,
        choice_text: "自動テストの実行ログを保存するストレージの購入費用",
        is_correct: false,
        explanation: "ストレージ費用も通常は支配的なコスト要因にはなりません。"
      }
    ],
    overall_explanation: "テスト自動化では「作成工数」に目が向きがちですが、長期的なライフサイクルにおいて最も大きな割合を占めるのは「環境変化や仕様改訂に伴うテスト自動化スクリプトの継続保守コスト」です。",
    syllabus_reference: "AL TM シラバス 6.1 テストツールと自動化",
    syllabus_section_id: "sec-tm-6-1"
  },
  {
    id: "qq-007",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "4.2",
    chapter_title: "欠陥情報の活用と根本原因分析",
    k_level: "K2",
    question_text: "根本原因分析（RCA: Root Cause Analysis）の主たる目的として、最も適切なものはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "バグを混入させた開発者を特定し、人事評価に反映させること。",
        is_correct: false,
        explanation: "犯人探し（Blame）は心理的安全性を損ない、欠陥隠蔽を招くため最も避けるべきアンチパターンです。"
      },
      {
        choice_number: 2,
        choice_text: "欠陥が作り込まれた根本的なプロセス上の原因を突き止め、将来の再発防止とプロセス改善を行うこと。",
        is_correct: true,
        explanation: "正解。RCAの目的は個人の追求ではなく、プロセスの弱点を特定して将来の混入を防ぐことです。"
      },
      {
        choice_number: 3,
        choice_text: "欠陥のステータスを即座に「Closed」に移行させるための手続き。",
        is_correct: false,
        explanation: "RCAは原因分析とプロセス改善のための活動であり、単なるステータス更新ではありません。"
      },
      {
        choice_number: 4,
        choice_text: "すべてのバグに対して修正パッチを即日作成すること。",
        is_correct: false,
        explanation: "RCAは原因追究手法であり、即日パッチ作成そのものを指すわけではありません。"
      }
    ],
    overall_explanation: "根本原因分析は「人」を責めるのではなく「プロセス・環境・仕様理解のどこに真因があったか」を究明し、組織的な再発防止策へ昇華させる活動です。",
    syllabus_reference: "AL TM シラバス 4.2 欠陥マネジメント",
    syllabus_section_id: "sec-tm-4-2"
  },
  {
    id: "qq-008",
    question_mode: "quick",
    syllabus_code: "AL_TM_v3.0",
    chapter_code: "7.1",
    chapter_number: 7,
    chapter_title: "テストチームのマネジメント",
    k_level: "K2",
    question_text: "開発チームから「独立したテストチーム」を組織することの主なメリットはどれか。",
    choices: [
      {
        choice_number: 1,
        choice_text: "作成者自身の先入観やバイアスにとらわれず、客観的かつ批判的な視点で欠陥を検出できること。",
        is_correct: true,
        explanation: "正解。独立したテスト担当者は作成者の思い込み（確証バイアス）を排除した検証を行えます。"
      },
      {
        choice_number: 2,
        choice_text: "開発チームとのコミュニケーションが一切不要になり、テストに専念できること。",
        is_correct: false,
        explanation: "コミュニケーションの遮断は孤立や誤解を生むためデメリットです。"
      },
      {
        choice_number: 3,
        choice_text: "テストケースの設計工数を完全にゼロにできること。",
        is_correct: false,
        explanation: "独立したチームであってもテスト分析・設計は不可欠です。"
      },
      {
        choice_number: 4,
        choice_text: "製品の品質保証責任をすべてテストチームのみに集約できること。",
        is_correct: false,
        explanation: "品質の作り込みはプロジェクト全員の責務であり、テストチーム単独に転嫁すべきではありません。"
      }
    ],
    overall_explanation: "テストの独立性は客観的な欠陥発見能力を高めますが、同時に開発者との協調関係と健全なコミュニケーションが維持される必要があります。",
    syllabus_reference: "AL TM シラバス 7.1 人のスキルとチーム構成 / FL シラバス 1.5 テストの心理学",
    syllabus_section_id: "sec-tm-7-1"
  }
];

export const initialScenarioGroups: Scenario[] = [
  {
    scenario_id: "sc-001",
    title: "ミッションクリティカルなFinTech決済システムのテストマネジメント",
    chapter_code: "2.2.3",
    chapter_title: "テスト実行におけるリスク軽減",
    related_section_id: "sec-tm-2-2-3",
    background_text: `あなたは、既存の決済中継システムをクラウドネイティブ環境へ移行する大規模プロジェクトのテストマネージャに任命されました。

【プロジェクトの前提条件】
・リリース予定日は3ヶ月後で固定（法改正対応のため延期不可）。
・開発チームはアジャイル（2週間スプリント）を採用しているが、テストチームはスプリント完了後に独立したシステムテスト・受入テストフェーズを担当。
・ステークホルダーとのリスク識別ワークショップを実施し、製品リスクを以下の2軸（1〜5の5段階）でスコアリングした。
  - 「発生可能性（Likelihood）」
  - 「影響度（Impact）」
  - リスク優先度（RPN / Risk Priority Number） = 発生可能性 × 影響度

【識別された主な製品リスクと現状】
| リスク識別子 | リスク概要 | 影響度 (1-5) | 発生可能性 (1-5) | RPN |
| :--- | :--- | :---: | :---: | :---: |
| リスクA | 決済APIの二重引き落とし防止機構の破綻 | 5 | 4 | 20 |
| リスクB | 秒間1万件アクセス時のトランザクション遅延・タイムアウト | 4 | 4 | 16 |
| リスクC | 管理画面のCSVエクスポート文字化け | 2 | 3 | 6 |
| リスクD | 多言語表示の特定レイアウト崩れ | 1 | 3 | 3 |

テスト実行フェーズ開始から2週間が経過し、リスクAに関する重要欠陥が開発側から「修正完了」として返却されましたが、リグレッションテストの工数が逼迫しています。`,
    questions: [
      {
        id: "sq-001-1",
        scenario_id: "sc-001",
        question_mode: "scenario",
        k_level: "K4",
        syllabus_code: "AL_TM_v3.0",
        chapter_code: "2.2.3",
        chapter_title: "テスト実行におけるリスク軽減",
        question_text: "リスクベースドテストの原則に基づき、テストマネージャとしてテストリソースおよびテスト実行順序をどのように再配分・意思決定すべきか。最も適切なものを1つ選べ。",
        choices: [
          {
            choice_number: 1,
            choice_text: "すべてのリスクカテゴリのテスト進捗を均等に保つため、リスクC・Dの未消化テストを優先して消化し、全体の消化率を底上げする。",
            is_correct: false,
            explanation: "消化率の見かけの向上を目的に低リスクのテストを優先することは、製品品質を脅かすアンチパターンです。"
          },
          {
            choice_number: 2,
            choice_text: "リスクCおよびDのテスト範囲を縮小またはステークホルダー合意のもと残存リスクとして受入保留とし、捻出したリソースをリスクAの再テストおよびリスクBの非機能テストに再配分する。",
            is_correct: true,
            explanation: "正解。期日が固定された制約下では、低RPN（C:6, D:3）のテストスコープを意図的に削減・合意し、高RPN（A:20, B:16）の検証にリソースを集中させるのがテストマネージャの適切な判断です。"
          },
          {
            choice_number: 3,
            choice_text: "リスクAは開発側の修正が完了したため、リスクレベルを1に引き下げ、以降のテスト対象から完全に除外する。",
            is_correct: false,
            explanation: "修正後には必ず確認テスト（再テスト）と副作用検証（リグレッションテスト）が必要であり、除外してはなりません。"
          },
          {
            choice_number: 4,
            choice_text: "延期不可の期日を守るため、テストチームの残業規制を一時的に解除し、リスクA〜Dのすべてのテストケースを計画通り100%実施する。",
            is_correct: false,
            explanation: "プロジェクト制約下でのスコープ調整を行わず無謀な稼働に依存することは、品質・人的マネジメントの観点から不適切です。"
          }
        ],
        overall_explanation: "リスクベースドテスト（RBT）の本質は、制約（時間・コスト）の中で高リスク領域に労力を集中し、低リスク領域は意識的に緩和・合意形成を行うトレードオフ管理にあります。",
        syllabus_reference: "AL TM シラバス 2.2 リスクベースドテスト / 2.2.3 リスクの監視とコントロール",
        syllabus_section_id: "sec-tm-2-2-3"
      },
      {
        id: "sq-001-2",
        scenario_id: "sc-001",
        question_mode: "scenario",
        k_level: "K3",
        syllabus_code: "AL_TM_v3.0",
        chapter_code: "2.6.2",
        chapter_title: "テストモニタリングとコントロール（メトリクス）",
        question_text: "経営陣およびプロジェクトスポンサーに対して、現在のテスト状況とリリースリスクを報告するダッシュボードを作成することになりました。報告内容として最も適切な組み合わせはどれか。",
        choices: [
          {
            choice_number: 1,
            choice_text: "「テストケース消化総数」と「発見された全欠陥の件数グラフ」のみを提示し、現場の詳細リスク数値は伏せる。",
            is_correct: false,
            explanation: "総数だけのメトリクスでは、どのビジネス重要機能にどれだけリスクが残っているかが経営陣に伝わりません。"
          },
          {
            choice_number: 2,
            choice_text: "リスク優先度別のテストカバレッジ状況、リスクA・Bに関する未解決欠陥の推移、および合意された終了基準（Exit Criteria）に対する達成度と残存リスクの評価。",
            is_correct: true,
            explanation: "正解。経営層・ステークホルダーには、RPN別のカバレッジ、高重大度欠陥の未解決状況、終了基準に対する到達度、およびリリース判断に必要な「残存リスク評価」を報告するのが適切です。"
          },
          {
            choice_number: 3,
            choice_text: "個々のテスターごとの欠陥発見数ランキングを公表し、テスター個人の生産性を主な進捗指標とする。",
            is_correct: false,
            explanation: "テスター個人評価に欠陥数を用いることは品質文化を損ねる上、製品のリリース可否判断の指標にはなりません。"
          },
          {
            choice_number: 4,
            choice_text: "開発チームのコードレビュー指摘件数を集計し、開発者のスキル不足を報告の主眼とする。",
            is_correct: false,
            explanation: "テストマネージャの報告責務はテスト対象製品のリスク状況と品質ステータスの可視化であり、他チームの批判ではありません。"
          }
        ],
        overall_explanation: "テスト報告では、ステークホルダーが客観的なリリース可否判断を下せるよう、テストの実行率だけでなく「リスク軸」でのカバレッジと残存欠陥の影響度を透明に示す必要があります。",
        syllabus_reference: "AL TM シラバス 2.6 テストの進捗モニタリングとコントロール",
        syllabus_section_id: "sec-tm-2-6-2"
      },
      {
        id: "sq-001-3",
        scenario_id: "sc-001",
        question_mode: "scenario",
        k_level: "K4",
        syllabus_code: "AL_TM_v3.0",
        chapter_code: "2.2.1",
        chapter_title: "残存リスク評価とリリース判断",
        question_text: "テスト最終フェーズにおいて、リスクC（管理画面CSV文字化け）の修正がリリース日に間に合わないことが判明しました。テストマネージャとして取るべき行動として最も適切なものはどれか。",
        choices: [
          {
            choice_number: 1,
            choice_text: "リスクCの存在を報告書から削除し、予定通りの満点合格としてリリース判定会議を通過させる。",
            is_correct: false,
            explanation: "既知のリスクの隠蔽はテストマネージャとして最大の背信行為であり、重大なガバナンス違反です。"
          },
          {
            choice_number: 2,
            choice_text: "業務運用回避策（UTF-8対応の特定ツールでの閲覧手順等）を添えて「残存リスク」としてステークホルダーへ提示し、許容可否の判断を仰ぐ。",
            is_correct: true,
            explanation: "正解。未解決の低リスク欠陥については、業務影響度とワークアラウンド（運用回避策）を明確にした上で、リリース判定権限を持つステークホルダーの判断に委ねます。"
          },
          {
            choice_number: 3,
            choice_text: "テストマネージャの職権により、リスクCが修正されるまでプロジェクト全体のリリース日を独断で延期する。",
            is_correct: false,
            explanation: "リリース延期の決定権はビジネスオーナーや経営層にあり、テストマネージャが独断でプロジェクトを停止することはできません。"
          },
          {
            choice_number: 4,
            choice_text: "リスクCは表示系の些細な問題であるため、回避策の検討も報告も行わず放置する。",
            is_correct: false,
            explanation: "軽微であっても残存リスクとして記録・報告・合意される必要があります。"
          }
        ],
        overall_explanation: "テストマネージャは残存リスクの受入可否を勝手に決めるのではなく、客観的なリスク評価と回避策（ワークアラウンド）をステークホルダーに提示して意思決定を支援します。",
        syllabus_reference: "AL TM シラバス 2.2.1 残存リスクのマネジメント",
        syllabus_section_id: "sec-tm-2-2-1"
      }
    ]
  },
  {
    scenario_id: "sc-002",
    title: "レガシー基幹ERPのクラウド移行におけるテスト改善と欠陥分析",
    chapter_code: "4.2",
    chapter_title: "欠陥情報の活用と根本原因分析",
    related_section_id: "sec-tm-4-2",
    background_text: `中堅製造業の基幹ERPシステム（受発注・在庫・会計）をオンプレミスからAWSクラウド基盤へリフト＆シフトするプロジェクトにおいて、受入テスト（UAT）フェーズで毎日15件以上の重要障害が発覚し、本番移行判定が「不可」となりました。

【現状のメトリクス集計結果】
1. **フェーズ別欠陥検出比率**:
   - 要件定義・基本設計レビュー: 5%
   - 単体テスト（開発担当）: 20%
   - 結合テスト（開発担当）: 25%
   - システムテスト（テスト専門チーム）: 15%
   - 受入テスト（ユーザー部門）: 35%
2. **欠陥の根本原因分析結果（上位3点）**:
   - 仕様書の記述の曖昧さ・陳腐化（42%）
   - 単体・結合テストでの境界値や例外系のテストケース漏れ（33%）
   - クラウド特有のネットワークレイテンシ考慮漏れ（15%）

あなたは品質立て直しのためのテストマネージャとして参画し、TMMiを活用したテストプロセス改善とシフトレフトの推進を提案することになりました。`,
    questions: [
      {
        id: "sq-002-1",
        scenario_id: "sc-002",
        question_mode: "scenario",
        k_level: "K4",
        syllabus_code: "AL_TM_v3.0",
        chapter_code: "4.2",
        chapter_title: "欠陥除去効率（DRE）の改善とシフトレフト",
        question_text: "現状のメトリクス（受入テストで35%の欠陥検出、原因の42%が仕様の曖昧さ）に対する改善施策として、最も根本的かつ効果的な「シフトレフト」施策はどれか。",
        choices: [
          {
            choice_number: 1,
            choice_text: "受入テストの実施期間を現在の3倍に延長し、テスターを大量増員してUATフェーズで全てのバグを出し切る。",
            is_correct: false,
            explanation: "後工程での人海戦術はシフトレフトに逆行し、手戻りコストを指数関数的に増大させます。"
          },
          {
            choice_number: 2,
            choice_text: "テストアナリストを要件定義・基本設計フェーズから早期アサインし、仕様書の公式インスペクションを実施してテスト観点を設計段階で注入する。",
            is_correct: true,
            explanation: "正解。欠陥の42%が仕様起因であるため、上流工程でのレビュー強化とテスト視点の注入（静的テストの早期実施）が最も高いDREとコスト削減をもたらします。"
          },
          {
            choice_number: 3,
            choice_text: "開発者に単体テストを免除し、その時間をコーディング速度向上に充てさせる。",
            is_correct: false,
            explanation: "単体テストの免除は下流工程への欠陥流出をさらに悪化させます。"
          },
          {
            choice_number: 4,
            choice_text: "仕様書を一切作成せず、動くコードのみで全てをユーザーに確認させるアジャイル方式に翌日から強制変更する。",
            is_correct: false,
            explanation: "基幹ERPの複雑な業務要件に対して無計画なドキュメント排除を行うと、品質崩壊を招きます。"
          }
        ],
        overall_explanation: "シフトレフトの神髄は、欠陥混入の最上流（要件や設計）において静的テスト（レビュー）を適用し、手戻りコストが最も安価な段階で欠陥を早期除去することにあります。",
        syllabus_reference: "AL TM シラバス 4.2 欠陥分析 / 3.2 レビューのマネジメント",
        syllabus_section_id: "sec-tm-4-2"
      },
      {
        id: "sq-002-2",
        scenario_id: "sc-002",
        question_mode: "scenario",
        k_level: "K3",
        syllabus_code: "AL_TM_v3.0",
        chapter_code: "5.1",
        chapter_title: "TMMiプロセス改善のロードマップ",
        question_text: "現在この組織はプロジェクトごとのテスト方針がバラバラで、テスト計画書も一部でしか作られていません。TMMiレベル2（管理された）を達成するために最優先で確立すべきプロセスエリアはどれか。",
        choices: [
          {
            choice_number: 1,
            choice_text: "全社的なAIテスト自動化ツールの導入と欠陥予防の統計的モデル構築",
            is_correct: false,
            explanation: "これはレベル4〜5の高度な最適化段階であり、レベル2の必須要件ではありません。"
          },
          {
            choice_number: 2,
            choice_text: "テスト方針・戦略の明文化、各プロジェクトでのテスト計画・モニタリング＆コントロール手順、テスト設計・実行プロセスの定着",
            is_correct: true,
            explanation: "正解。TMMiレベル2のキープロセスエリアは「テスト方針と戦略」「テスト計画」「テストモニタリングとコントロール」「テスト設計と実行」「テスト環境」です。"
          },
          {
            choice_number: 3,
            choice_text: "開発者の人事考課基準の改定と外部ベンダーの全面交代",
            is_correct: false,
            explanation: "TMMiプロセスの定義項目ではありません。"
          },
          {
            choice_number: 4,
            choice_text: "テストフェーズを1つに集約し、テストドキュメントをすべて廃止すること",
            is_correct: false,
            explanation: "プロセスの管理・再現性に反します。"
          }
        ],
        overall_explanation: "TMMi レベル2は『テストプロセスが管理されている』状態を確立することであり、計画・監視・テスト設計の基本プロセスエリアを各プロジェクトで確実に運用することが目標です。",
        syllabus_reference: "AL TM シラバス 5.1 テストプロセス改善モデル",
        syllabus_section_id: "sec-tm-5-1"
      }
    ]
  }
];

