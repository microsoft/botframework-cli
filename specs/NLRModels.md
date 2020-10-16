## 									-- DRAFT --



# Natural Language Representation Model


Turing Natural Language Representation (Turing *NLR*) models are generic language representation models which have been trained towards more sophisticated pretraining tasks for both monolingual as well as multilingual scenarios. Turing NLR models are used as a natural replacement for BERT-like models.

## Models

### Turing NLR v3
Turing NLR v3 is the latest NLR (monolingual) model which belongs to the transformer (BERT-like) family of models. This is a hybrid model which has both representation as well as generation capabilities. This model was pretrained using bi-directional LM (via Auto Encoding) and sequence-to-sequence LM (via Partially Auto-Regressive) with Pseudo-Masked Language Model. See paper [1] for details.

**TBD - add more**



## References

[1]: https://arxiv.org/abs/2002.12804 "UniLMv2: Pseudo-Masked Language Models for Unified Language Model Pre-Training"

[UniLMv2 Paper]: https://arxiv.org/abs/2002.12804