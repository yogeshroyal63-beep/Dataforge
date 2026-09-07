import React from 'react';
import { BookOpen, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const Sources = () => {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Page Header */}
      <SectionHeader
        eyebrow="Bibliography & Disclosure"
        title="Sources & Research"
        description="Academic references, architectural documentation, methodology, and AI disclosure statements."
        align="left"
      />

      <div className="space-y-6">
        {/* 1. Primary Sources */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-lab-accent" />
            <h3 className="text-base font-bold text-lab-text-primary">Primary Sources</h3>
            <Badge variant="accent" size="sm">Pathway</Badge>
          </div>
          <Card variant="standard" className="p-5">
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              Foundational documentation and whitepapers regarding Pathway's streaming computation engine and BDH-CQ recurrent state context handling. Verified paper citations, authors, and DOI links will be cataloged in Phase 6.
            </p>
          </Card>
        </section>

        {/* 2. Linear Attention Research */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-lab-purple" />
            <h3 className="text-base font-bold text-lab-text-primary">Linear Attention Research</h3>
            <Badge variant="research" size="sm">Foundational Literature</Badge>
          </div>
          <Card variant="standard" className="p-5">
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              Kernel-based attention formulations, fast autoregressive transformers (Katharopoulos et al., Choromanski et al.), and associative state representations. Specific paper references are reserved for verified inclusion in Phase 6.
            </p>
          </Card>
        </section>

        {/* 3. Methodology */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-lab-success" />
            <h3 className="text-base font-bold text-lab-text-primary">Methodology</h3>
            <Badge variant="success" size="sm">Protocols</Badge>
          </div>
          <Card variant="standard" className="p-5">
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              Associative recall testing methodology using synthetic key-value pairs. Outlines controlled variables (number of facts, sequence order, state dimension) and evaluation criteria for exact retrieval.
            </p>
          </Card>
        </section>

        {/* 4. AI Assistance Disclosure */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lab-text-muted" />
            <h3 className="text-base font-bold text-lab-text-primary">AI Assistance Disclosure</h3>
            <Badge variant="default" size="sm">Transparency</Badge>
          </div>
          <Card variant="standard" className="p-5">
            <p className="text-xs text-lab-text-secondary leading-relaxed">
              This interactive application was created as an educational artifact for DataForge 2026. Generative models aided in UI scaffolding and pedagogical layout. All architectural assertions and mathematical models undergo systematic validation.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Sources;
